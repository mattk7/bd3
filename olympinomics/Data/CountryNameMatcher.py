#!/usr/bin/python
import csv

WB_rows = csv.reader(open('WBData.csv', 'r'), delimiter=',', quotechar='"')
WB_Countries = {}
for row in WB_rows:
	CountryName = row[2]
	WB_Countries[CountryName] = 1

oly_rows = csv.reader(open('olympics_2012.csv', 'r'), delimiter=',', quotechar='"')
olyCountries = {}
for row in oly_rows:
	CountryName = row[1]
	olyCountries[CountryName] = 1

foutOly = open('OlyNotMatched.txt','w')
for CountryName in olyCountries:
	if CountryName not in WB_Countries:
		foutOly.write(CountryName+'\n')
foutOly.close()

foutWB = open('WBNotMatched.txt','w')
for CountryName in WB_Countries:
	if CountryName not in olyCountries:
		foutWB.write(CountryName+'\n')
foutWB.close()
