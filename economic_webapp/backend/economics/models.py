from django.conf import settings
import requests
from django.http import JsonResponse
from collections import defaultdict
import json
 



"""
api_key = settings.TRADING_ECONOMICS_API_KEY

url = f'https://api.tradingeconomics.com/historical/country/mexico,sweden/indicator/gdp/?c={api_key}'
data = requests.get(url).json()
gdp_data = defaultdict(dict)
entries = [gdp_data[entry["Country"]].update({entry["DateTime"][:4]: entry["Value"]}) for entry in data]
#gdp_data.popitem()
print(json.dumps(gdp_data, indent=4))

"""
