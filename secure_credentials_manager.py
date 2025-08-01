"""
Smart Cooking AI - Secure Credentials Manager
Manages Google OAuth and Service Account credentials securely
"""

import os
import json
import keyring
from pathlib import Path
from typing import Dict, Optional
import warnings

class SecureCredentialsManager:
    """Secure management of Google credentials outside Git repository"""
    
    def __init__(self):
        self.app_name = "SmartCookingAI"
        self.credentials_dir = Path.home() / ".smart_cooking_ai" / "credentials"
        self.credentials_dir.mkdir(parents=True, exist_ok=True)
        
        # Ensure credentials directory is protected
        if os.name != 'nt':  # Unix/Linux/Mac
            os.chmod(self.credentials_dir, 0o700)
    
    def save_oauth_credentials(self, client_id: str, client_secret: str, 
                             project_id: str, redirect_uris: list = None) -> str:
        """Save OAuth credentials securely"""
        
        oauth_config = {
            "web": {
                "client_id": client_id,
                "project_id": project_id,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_secret": client_secret,
                "redirect_uris": redirect_uris or [
                    "http://localhost:3000/auth",
                    "http://localhost:8080/auth",
                    "http://localhost:54072/auth"
                ],
                "javascript_origins": [
                    "http://localhost:3000",
                    "http://localhost:8080",
                    "http://localhost:54072"
                ]
            }
        }
        
        # Save to secure file
        oauth_file = self.credentials_dir / "oauth_client.json"
        with open(oauth_file, 'w') as f:
            json.dump(oauth_config, f, indent=2)
        
        # Also save to system keyring for extra security
        try:
            keyring.set_password(self.app_name, "oauth_client_id", client_id)
            keyring.set_password(self.app_name, "oauth_client_secret", client_secret)
        except Exception as e:
            warnings.warn(f"Could not save to keyring: {e}")
        
        print(f"✅ OAuth credentials saved to: {oauth_file}")
        return str(oauth_file)
    
    def save_service_account(self, service_account_data: dict) -> str:
        """Save service account credentials securely"""
        
        # Save to secure file
        sa_file = self.credentials_dir / "service_account.json"
        with open(sa_file, 'w') as f:
            json.dump(service_account_data, f, indent=2)
        
        # Save key info to keyring
        try:
            keyring.set_password(self.app_name, "service_account_email", 
                               service_account_data.get("client_email", ""))
            keyring.set_password(self.app_name, "project_id", 
                               service_account_data.get("project_id", ""))
        except Exception as e:
            warnings.warn(f"Could not save to keyring: {e}")
        
        print(f"✅ Service Account credentials saved to: {sa_file}")
        return str(sa_file)
    
    def get_oauth_credentials(self) -> Optional[Dict]:
        """Get OAuth credentials"""
        oauth_file = self.credentials_dir / "oauth_client.json"
        
        if oauth_file.exists():
            with open(oauth_file, 'r') as f:
                return json.load(f)
        
        # Try keyring fallback
        try:
            client_id = keyring.get_password(self.app_name, "oauth_client_id")
            client_secret = keyring.get_password(self.app_name, "oauth_client_secret")
            
            if client_id and client_secret:
                return {
                    "web": {
                        "client_id": client_id,
                        "client_secret": client_secret
                    }
                }
        except Exception:
            pass
        
        return None
    
    def get_service_account(self) -> Optional[Dict]:
        """Get service account credentials"""
        sa_file = self.credentials_dir / "service_account.json"
        
        if sa_file.exists():
            with open(sa_file, 'r') as f:
                return json.load(f)
        
        return None
    
    def setup_environment_variables(self):
        """Setup environment variables pointing to credential files"""
        oauth_file = self.credentials_dir / "oauth_client.json"
        sa_file = self.credentials_dir / "service_account.json"
        
        env_vars = {}
        
        if oauth_file.exists():
            env_vars["GOOGLE_OAUTH_CREDENTIALS"] = str(oauth_file)
        
        if sa_file.exists():
            env_vars["GOOGLE_APPLICATION_CREDENTIALS"] = str(sa_file)
        
        # Create .env file with secure paths
        env_file = Path(".env.secure")
        with open(env_file, 'w') as f:
            f.write("# Secure Google Credentials - Generated automatically\n")
            f.write("# These files are stored outside Git repository\n\n")
            
            for key, value in env_vars.items():
                f.write(f"{key}={value}\n")
        
        print(f"✅ Environment variables saved to: {env_file}")
        return env_vars
    
    def migrate_from_exposed_credentials(self, old_oauth_file: str, old_sa_file: str):
        """Migrate from exposed credentials to secure storage"""
        print("🔄 Migrating exposed credentials to secure storage...")
        
        # Migrate OAuth credentials
        if os.path.exists(old_oauth_file):
            with open(old_oauth_file, 'r') as f:
                oauth_data = json.load(f)
            
            web_config = oauth_data.get("web", {})
            self.save_oauth_credentials(
                client_id=web_config.get("client_id", ""),
                client_secret=web_config.get("client_secret", ""),
                project_id=web_config.get("project_id", ""),
                redirect_uris=web_config.get("redirect_uris", [])
            )
        
        # Migrate Service Account
        if os.path.exists(old_sa_file):
            with open(old_sa_file, 'r') as f:
                sa_data = json.load(f)
            
            self.save_service_account(sa_data)
        
        # Setup environment
        self.setup_environment_variables()
        
        print("✅ Migration completed!")
        print("🔒 Credentials now stored securely outside Git repository")
        print(f"📁 Location: {self.credentials_dir}")

def main():
    """Main setup function"""
    print("🔐 SMART COOKING AI - SECURE CREDENTIALS SETUP")
    print("=" * 50)
    
    manager = SecureCredentialsManager()
    
    print("\n🛡️ This tool helps you setup Google credentials securely")
    print("✅ Credentials will be stored outside Git repository")
    print("❌ No sensitive data will ever be committed to Git")
    
    print("\n📋 Choose setup method:")
    print("1. 🆕 Create new credentials (recommended)")
    print("2. 🔄 Migrate from exposed credentials")
    print("3. ✋ Exit")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == "1":
        setup_new_credentials(manager)
    elif choice == "2":
        migrate_exposed_credentials(manager)
    else:
        print("👋 Goodbye!")

def setup_new_credentials(manager):
    """Setup new credentials"""
    print("\n🆕 NEW CREDENTIALS SETUP")
    print("-" * 30)
    
    print("\n📝 Please provide your NEW Google credentials:")
    print("🔗 Get them from: https://console.cloud.google.com/apis/credentials")
    
    # OAuth credentials
    print("\n🔐 OAuth 2.0 Client:")
    client_id = input("Client ID: ").strip()
    client_secret = input("Client Secret: ").strip()
    project_id = input("Project ID: ").strip()
    
    if client_id and client_secret and project_id:
        manager.save_oauth_credentials(client_id, client_secret, project_id)
    
    # Service Account (optional)
    print("\n🤖 Service Account (optional):")
    sa_choice = input("Do you have a service account JSON file? (y/n): ").strip().lower()
    
    if sa_choice == 'y':
        sa_path = input("Enter path to service account JSON file: ").strip()
        if os.path.exists(sa_path):
            with open(sa_path, 'r') as f:
                sa_data = json.load(f)
            manager.save_service_account(sa_data)
        else:
            print("❌ File not found, skipping service account")
    
    # Setup environment
    manager.setup_environment_variables()
    
    print("\n✅ Setup completed successfully!")
    print("🚀 Your credentials are now secure and ready to use")

def migrate_exposed_credentials(manager):
    """Migrate from exposed credentials"""
    print("\n🔄 MIGRATE EXPOSED CREDENTIALS")
    print("-" * 35)
    print("⚠️  This will help you move credentials from Git history to secure storage")
    
    # Note: We can't actually access the exposed files since they should be deleted
    # But we can guide the user through creating new ones
    
    print("\n🚨 IMPORTANT: You should create NEW credentials, not reuse exposed ones!")
    print("🔗 Go to: https://console.cloud.google.com/apis/credentials")
    print("1. Delete/disable the old OAuth client and Service Account")
    print("2. Create new ones")
    print("3. Come back here with the new credentials")
    
    proceed = input("\nHave you created new credentials? (y/n): ").strip().lower()
    if proceed == 'y':
        setup_new_credentials(manager)
    else:
        print("🔒 Please create new credentials first for security!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️ Setup cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("🔧 Please check your inputs and try again")
