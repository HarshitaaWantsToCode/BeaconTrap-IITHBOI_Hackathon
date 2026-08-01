from fastapi import APIRouter, HTTPException
from uuid import UUID
from backend.app.services.graph_service import CampaignGraph
import os

router = APIRouter()

@router.get("/{case_id}")
def get_campaign_graph(case_id: UUID):
    try:
        graph = CampaignGraph()
        related = graph.find_related_campaigns(str(case_id))
        graph.close()
        
        # Transform the result into node/edge format expected by the frontend
        nodes = [{"id": str(case_id), "label": "APK", "properties": {"is_source": True}}]
        edges = []
        
        added_nodes = set([str(case_id)])
        
        for record in related:
            related_case = record.get("related_case")
            link_type_list = record.get("link_type", [])
            shared_node = record.get("shared", {})
            
            # The shared node ID is tricky since it's a Neo4j Node object, we can construct an ID
            link_type = link_type_list[0] if link_type_list else "Shared"
            shared_id = f"{link_type}-{related_case}"
            
            # Add the shared indicator node if not added
            if shared_id not in added_nodes:
                nodes.append({"id": shared_id, "label": link_type, "properties": dict(shared_node)})
                added_nodes.add(shared_id)
                # Edge from source to shared
                edges.append({"source": str(case_id), "target": shared_id, "type": "SHARES"})
                
            # Add the related APK node if not added
            if related_case not in added_nodes:
                nodes.append({"id": related_case, "label": "APK", "properties": {"is_source": False}})
                added_nodes.add(related_case)
                
            # Edge from related to shared
            edges.append({"source": related_case, "target": shared_id, "type": "SHARES"})
            
        return {
            "nodes": nodes,
            "edges": edges
        }
    except Exception as e:
        # Graceful fallback if Neo4j is down
        print(f"[!] Campaign graph error: {e}")
        return {
            "nodes": [{"id": str(case_id), "label": "APK", "properties": {"error": str(e)}}],
            "edges": []
        }
