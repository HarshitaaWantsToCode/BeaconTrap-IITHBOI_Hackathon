from androguard.core.apk import APK
from typing import Dict, Any

class ManifestParser:
    @staticmethod
    def parse(file_path: str) -> Dict[str, Any]:
        try:
            apk = APK(file_path)
            
            # Extract intent filters if possible
            intent_filters = []
            
            return {
                "package_name": apk.get_package(),
                "version_code": apk.get_androidversion_code(),
                "version_name": apk.get_androidversion_name(),
                "min_sdk": apk.get_min_sdk_version(),
                "target_sdk": apk.get_target_sdk_version(),
                "permissions": list(apk.get_permissions()),
                "activities": list(apk.get_activities()),
                "services": list(apk.get_services()),
                "receivers": list(apk.get_receivers()),
                "providers": list(apk.get_providers()),
                "intent_filters": intent_filters
            }
        except Exception as e:
            return {
                "error": f"Failed to parse manifest: {str(e)}",
                "permissions": [],
                "activities": [],
                "services": [],
                "receivers": [],
                "providers": []
            }
