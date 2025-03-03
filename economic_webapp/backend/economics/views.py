from django.shortcuts import render
import requests
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from collections import defaultdict




# Retrieve the trading economics api key securely from .env
api_key = settings.TRADING_ECONOMICS_API_KEY


@require_GET
def economics_country_camparison(request):
    """ Compare two countries base on various economic indicators """
    
    country_1 = request.GET.get("country1", "").strip().lower()
    country_2 = request.GET.get("country2", "").strip().lower()    
    
    if not api_key:
        return JsonResponse({"error": "API key not found"}, status=500)
    if not country_1 or not country_2:
        return JsonResponse({"error": "Missing required parameters. Provide two countries"}, status=400)
    
    url = f'https://api.tradingeconomics.com/historical/country/{country_1},{country_2}/indicator/gdp/?c={api_key}'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if not data:
            return JsonResponse({"error": "No data found"}, status=404)
        
        gdp_data = defaultdict(dict)
        entries = [gdp_data[entry["Country"]].update({entry["DateTime"][:4]: entry["Value"]}) for entry in data]
        gdp_data.popitem()
        return JsonResponse(gdp_data)
    
    except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        



    
    

