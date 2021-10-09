# By @vv1ck @TweakPY
import requests

# abbreviation for tool
# print(requests.get('https://jftv.pythonanywhere.com/email='+input('Enter email : ')).text)

email = input('Enter email : ')
sent = requests.get('https://jftv.pythonanywhere.com/email='+email).text
if 'True' in sent:
 print('Email is Not available')
elif 'False' in sent:
 print('Email is available')
else:
 print(sent)
