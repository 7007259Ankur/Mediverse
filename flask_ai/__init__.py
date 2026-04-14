from .health_routes import health_bp

def init_health_module(app):
    app.register_blueprint(health_bp, url_prefix='/api/health')
    print("Health prediction module initialized")