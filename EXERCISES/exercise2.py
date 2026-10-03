import requests
from rich.console import Console
from rich.table import Table

#Get planets data from web API
url = "https://swapi.info/api/planets"
response = requests.get(url)
data = response.json()

#Build table and its header
console = Console()
table = Table(show_header = True, header_style = "bold")
table.add_column("NAME", style="magenta")
table.add_column("DIAMETER", style="blue")
table.add_column("POPULATION", style="green")

i = 0
for planet in data:
    #Check if fields exist
    if not planet.get("name") or not planet.get("diameter") or not planet.get("population"):
        console.print("[bold red]Invalid field(s)[/bold red]")
        break
    #Add row to table and planet data
    if i <= 10:
        table.add_row(planet["name"], planet["diameter"], planet["population"])
    else:
        #Only print 10 first planets from list
        break
    i = i + 1

console.print(table)
