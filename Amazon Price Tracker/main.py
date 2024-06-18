# Import the libraries
from bs4 import BeautifulSoup
import requests
import time
import datetime
import pandas as pd
import csv

# Connect to APIs
import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive']

creds = ServiceAccountCredentials.from_json_keyfile_name('secret_file.json')

file =  gspread.authorize(creds)

workbook = file.open("Excel Name")
worksheet = workbook.worksheet('Sheet Name')
data = worksheet.get_all_values()
data = pd.DataFrame(columns=["URL"], data=data)
# print(data)



# Connect with data


headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }

def check_price(data):

    for i in data['URL']:
        URL = i

        print(i)

        try:
            page = requests.get(URL, headers=headers)
            soup = BeautifulSoup(page.content, 'html.parser')
            
            title = soup.find(id='productTitle').get_text().strip()
            price = soup.find(class_='a-price-whole').get_text().strip()
            
            today = datetime.date.today().strftime('%Y-%m-%d')
            
            data = [title, price, today]
            
            with open('dataset.csv', 'a+', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow(data)
            
            print(f'Price for {title} on {today}: {price}')
            print()
        
        except Exception as e:
            print(f'Error: {e}')
            print('Retrying in 5 seconds...')
            print()
            time.sleep(5)
            check_price(data)
        

for i in range(2):
    print()
    check_price(data)
    time.sleep(10)