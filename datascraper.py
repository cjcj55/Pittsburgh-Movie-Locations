from bs4 import BeautifulSoup
import requests
import csv

# URL of the IMDb list of movies filmed in San Francisco
url = 'https://www.imdb.com/search/title/?locations=San%2C+Francisco%2C+California%2C+USA'
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')

# Select all movie titles
movies = soup.select('.lister-item-header a')

# List to store movie data
movie_data = []

# Loop through each movie
for movie in movies:
    # Get the movie title and URL
    title = movie.text
    movie_url = 'https://www.imdb.com' + movie['href']

    # Extract the movie_id from the movie_url
    movie_id = movie_url.split('/')[4]

    # Construct the location URL
    location_url = f'https://www.imdb.com/title/{movie_id}/locations/'

    # Send a request to the location URL
    location_response = requests.get(location_url)
    location_soup = BeautifulSoup(location_response.text, 'html.parser')

    # Find the location of the movie
    location_element = location_soup.select_one('.soda p')
    if location_element:
        location = location_element.text.strip()
    else:
        location = 'Unknown'

    # Add the movie title and location to the list
    movie_data.append((title, location))

# Write the movie data to a CSV file
with open('san-francisco-film-locations.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['Movie', 'Location'])
    writer.writerows(movie_data)
