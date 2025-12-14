"""Domain Configuration Loader

Loads and validates YAML domain configurations.
"""

import yaml
from pathlib import Path
from typing import Dict, Any, List
from dataclasses import dataclass


@dataclass
class DomainConfig:
    """Domain configuration data class"""
    domain_name: str
    domain_id: str
    version: str
    description: str
    difficulty_levels: Dict[str, Any]
    allowed_languages: List[Dict[str, Any]]
    constraints: Dict[str, Any]
    expected_output_format: Dict[str, Any]
    accuracy_rules: Dict[str, Any]
    explanation_depth: Dict[str, Any]
    topic_categories: Any
    ai_assistant: Dict[str, Any]
    features: Dict[str, Any]
    raw_config: Dict[str, Any]


class DomainConfigLoader:
    """Loads domain configurations from YAML files"""
    
    def __init__(self, config_dir: str = None):
        """
        Initialize the domain config loader.
        
        Args:
            config_dir: Directory containing domain YAML files
        """
        if config_dir:
            self.config_dir = Path(config_dir)
        else:
            self.config_dir = Path(__file__).parent
    
    def load_domain(self, domain_id: str) -> DomainConfig:
        """
        Load a domain configuration.
        
        Args:
            domain_id: Domain identifier (e.g., 'competitive_programming')
            
        Returns:
            DomainConfig object
            
        Raises:
            FileNotFoundError: If domain config file doesn't exist
            ValueError: If config is invalid
        """
        config_file = self.config_dir / f"{domain_id}.yaml"
        
        if not config_file.exists():
            raise FileNotFoundError(f"Domain config not found: {config_file}")
        
        with open(config_file, 'r') as f:
            config = yaml.safe_load(f)
        
        # Validate required fields
        required_fields = [
            'domain_name', 'domain_id', 'version', 'difficulty_levels',
            'allowed_languages', 'constraints', 'expected_output_format',
            'accuracy_rules', 'explanation_depth'
        ]
        
        for field in required_fields:
            if field not in config:
                raise ValueError(f"Missing required field: {field}")
        
        return DomainConfig(
            domain_name=config['domain_name'],
            domain_id=config['domain_id'],
            version=config['version'],
            description=config.get('description', ''),
            difficulty_levels=config['difficulty_levels'],
            allowed_languages=config['allowed_languages'],
            constraints=config['constraints'],
            expected_output_format=config['expected_output_format'],
            accuracy_rules=config['accuracy_rules'],
            explanation_depth=config['explanation_depth'],
            topic_categories=config.get('topic_categories', []),
            ai_assistant=config.get('ai_assistant', {}),
            features=config.get('features', {}),
            raw_config=config
        )
    
    def load_all_domains(self) -> Dict[str, DomainConfig]:
        """
        Load all domain configurations.
        
        Returns:
            Dictionary mapping domain_id to DomainConfig
        """
        domains = {}
        
        for yaml_file in self.config_dir.glob('*.yaml'):
            if yaml_file.name.startswith('_'):
                continue  # Skip private files
            
            domain_id = yaml_file.stem
            try:
                domains[domain_id] = self.load_domain(domain_id)
            except Exception as e:
                print(f"Warning: Failed to load domain {domain_id}: {e}")
        
        return domains
    
    def get_available_domains(self) -> List[str]:
        """
        Get list of available domain IDs.
        
        Returns:
            List of domain identifiers
        """
        return [f.stem for f in self.config_dir.glob('*.yaml') 
                if not f.name.startswith('_')]


# Global loader instance
loader = DomainConfigLoader()

# Convenience functions
def load_domain(domain_id: str) -> DomainConfig:
    """Load a domain configuration"""
    return loader.load_domain(domain_id)

def load_all_domains() -> Dict[str, DomainConfig]:
    """Load all domain configurations"""
    return loader.load_all_domains()

def get_available_domains() -> List[str]:
    """Get list of available domains"""
    return loader.get_available_domains()


__all__ = [
    'DomainConfig',
    'DomainConfigLoader',
    'load_domain',
    'load_all_domains',
    'get_available_domains',
]
