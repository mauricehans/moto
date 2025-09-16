from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
@staff_member_required
def admin_diagnostic_page(request):
    """Page HTML de diagnostic email pour l'administration"""
    return render(request, 'admin/email_diagnostic.html', {
        'title': 'Diagnostic Email',
        'user': request.user,
    })