from typing import Dict, Any

class BrandingManager:
    @staticmethod
    def get_branding(bank_name: str = "IITH BOI") -> Dict[str, Any]:
        return {
            "bank_name": bank_name,
            "logo_url": "https://beacontrap.local/assets/logo.png",
            "primary_color": "#0F172A",
            "secondary_color": "#3B82F6",
            "footer_text": "CONFIDENTIAL // BEACONTRAP SECURITY THREAT INTELLIGENCE",
            "watermark": "RESTRICTED DISTRIBUTION"
        }
