# By @vv1ck @TweakPY
import requests
# abbreviation for tool
print(
 requests.get('https://jftv.pythonanywhere.com/ip/'+input('Enter Ip: ')
 ).text
)
