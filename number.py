# By @vv1ck @TweakPY
import requests
# abbreviation for tool
print(
 requests.get('https://jftv.pythonanywhere.com/Number-Info/'+input('country code : ')+'/'+input('Enter number : ')
 ).text
)
