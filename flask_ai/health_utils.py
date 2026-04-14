from .constants import DOMAIN_CONFIG

def validate_input(domain, input_data):
    if domain not in DOMAIN_CONFIG:
        return {'valid': False, 'message': 'Invalid domain'}
    
    missing_fields = []
    for field in DOMAIN_CONFIG[domain]['features']:
        if field not in input_data:
            missing_fields.append(field)
    
    if missing_fields:
        return {
            'valid': False,
            'message': f"Missing required fields: {', '.join(missing_fields)}"
        }
    
    try:
        for field in DOMAIN_CONFIG[domain]['features']:
            float(input_data[field])
    except ValueError:
        return {
            'valid': False,
            'message': f"Invalid numeric value for field: {field}"
        }
    
    return {'valid': True}