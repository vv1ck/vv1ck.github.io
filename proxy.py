# By @vv1ck @TweakPY
import requests
# abbreviation for tool
print(
 requests.get('https://jftv.pythonanywhere.com/Proxy/'+input('Enter Protocol here Like (https/http/socks4/5) : ')
 ).text
)
