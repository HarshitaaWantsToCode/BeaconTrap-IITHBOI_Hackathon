from neo4j import GraphDatabase
import os

class CampaignGraph:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            os.environ.get("NEO4J_URL", "bolt://localhost:7687"),
            auth=(os.environ.get("NEO4J_USER", "neo4j"), os.environ.get("NEO4J_PASSWORD", "neo4jpassword")),
        )

    def close(self):
        self.driver.close()

    def upsert_apk_case(self, case_id: str, cert_fingerprint: str,
                         c2_domains: list[str], ips: list[str]):
        with self.driver.session() as session:
            session.execute_write(self._write_case, case_id, cert_fingerprint, c2_domains, ips)

    @staticmethod
    def _write_case(tx, case_id, cert_fp, domains, ips):
        tx.run("""
            MERGE (a:APK {case_id: $case_id})
            MERGE (c:SigningCert {fingerprint: $cert_fp})
            MERGE (a)-[:SIGNED_WITH]->(c)
            WITH a
            UNWIND $domains AS d
              MERGE (dom:Domain {name: d})
              MERGE (a)-[:COMMUNICATES_WITH]->(dom)
            WITH a
            UNWIND $ips AS ip
              MERGE (i:IP {addr: ip})
              MERGE (a)-[:COMMUNICATES_WITH]->(i)
        """, case_id=case_id, cert_fp=cert_fp, domains=domains, ips=ips)

    def find_related_campaigns(self, case_id: str) -> list[dict]:
        """Real campaign attribution: shared cert or shared C2 = same campaign."""
        with self.driver.session() as session:
            return session.execute_read(self._query_related, case_id)

    @staticmethod
    def _query_related(tx, case_id):
        result = tx.run("""
            MATCH (a:APK {case_id: $case_id})-[:SIGNED_WITH|COMMUNICATES_WITH]->(shared)
                  <-[:SIGNED_WITH|COMMUNICATES_WITH]-(other:APK)
            WHERE other.case_id <> $case_id
            RETURN DISTINCT other.case_id AS related_case, labels(shared) AS link_type, shared
        """, case_id=case_id)
        return [dict(r) for r in result]
