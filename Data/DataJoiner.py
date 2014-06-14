#!/usr/bin/python
import csv

# Read in csv's and join.

CountriesData = {}

WBFocusMeasures = ["GNI per capita,  PPP (current international $)", "GDP per capita (current US$)", "Population (Total)", "GINI index", "GNI per capita Atlas method (current US$)", "GDP (current US$)"]

OLY_rows = csv.reader(open('olympics_2012_Clean.csv', 'r'), delimiter=',', quotechar='"')
PureMeasures = ['Medals', 'Athletes', 'Medalists', 'Gold', 'Silver', 'Bronze']
NormalizingFactors = ['Population', 'Athletes']
Filters = {'Sex': [], 'Sport': []}

counter = 0
for row in OLY_rows:
	if counter != 0:
		AthleteSex = row[5]
		AthleteSport = row[6]
		if AthleteSex not in Filters['Sex']:
			Filters['Sex'].append(AthleteSex)
		if AthleteSport not in Filters['Sport']:
			Filters['Sport'].append(AthleteSport)
	counter += 1

WB_rows = csv.reader(open('WBData_Clean.csv', 'r'), delimiter=',', quotechar='"')
counter = 0
for row in WB_rows:
	if counter != 0:
		DataType = row[0]
		if DataType in WBFocusMeasures:
			if DataType == "Population (Total)":
				DataType = "Population"
			Country = row[2]
			Values = row[4:]
			if Country not in CountriesData:
				CountriesData[Country] = {}
				for WBFocusMeasure in WBFocusMeasures:
					if WBFocusMeasure == "Population (Total)":
						WBFocusMeasure = "Population"
					CountriesData[Country][WBFocusMeasure] = 'null'
				for PureMeasure in PureMeasures:
					CountriesData[Country][PureMeasure] = 0.0
					for Filter in Filters['Sex']:
						CountriesData[Country][PureMeasure+'|'+Filter] = 0.0
					for Filter in Filters['Sport']:
						CountriesData[Country][PureMeasure+'|'+Filter] = 0.0

			for i in range(len(Values)-1, -1, -1):
				if Values[i] != '':
					CountriesData[Country][DataType] = Values[i]
	counter += 1

OLY_rows = csv.reader(open('olympics_2012_Clean.csv', 'r'), delimiter=',', quotechar='"')
counter = 0
for row in OLY_rows:
	if counter != 0:
		Country = row[1]
		CountriesData[Country]['Athletes'] += 1.0
		AthleteSex = row[5]
		AthleteAge = row[2]
		AthleteSport = row[6]
		AthleteMedals = 0.0
		if row[9] != '':
			AthleteMedals += float(row[9])
			AthleteGold = float(row[9])
		else:
			AthleteGold = 0.0
		if row[10] != '':
			AthleteMedals += float(row[10])
			AthleteSilver = float(row[10])
		else:
			AthleteSilver = 0.0
		if row[11] != '':
			AthleteMedals += float(row[11])
			AthleteBronze = float(row[11])
		else:
			AthleteBronze = 0.0
		
		CountriesData[Country]['Medals'] += AthleteMedals
		if AthleteMedals > 0.0:
			CountriesData[Country]['Medalists'] += 1.0
		CountriesData[Country]['Gold'] += AthleteGold
		CountriesData[Country]['Silver'] += AthleteSilver
		CountriesData[Country]['Bronze'] += AthleteBronze

		CountriesData[Country]['Medals|'+AthleteSex] += AthleteMedals
		CountriesData[Country]['Athletes|'+AthleteSex] += 1.0
		if AthleteMedals > 0.0:
			CountriesData[Country]['Medalists|'+AthleteSex] += 1.0
		CountriesData[Country]['Gold|'+AthleteSex] += AthleteGold
		CountriesData[Country]['Silver|'+AthleteSex] += AthleteSilver
		CountriesData[Country]['Bronze|'+AthleteSex] += AthleteBronze

		CountriesData[Country]['Medals|'+AthleteSport] += AthleteMedals
		CountriesData[Country]['Athletes|'+AthleteSport] += 1.0
		if AthleteMedals > 0.0:
			CountriesData[Country]['Medalists|'+AthleteSport] += 1.0
		CountriesData[Country]['Gold|'+AthleteSport] += AthleteGold
		CountriesData[Country]['Silver|'+AthleteSport] += AthleteSilver
		CountriesData[Country]['Bronze|'+AthleteSport] += AthleteBronze
	counter += 1

for NormalizingFactor in NormalizingFactors:
	for Country in CountriesData:
		for PureMeasure in PureMeasures:
			if CountriesData[Country][NormalizingFactor] != 'null':
				CountriesData[Country][PureMeasure+' per '+NormalizingFactor] = float(CountriesData[Country][PureMeasure])/float(CountriesData[Country][NormalizingFactor])
			else:
				CountriesData[Country][PureMeasure+' per '+NormalizingFactor] = 'null'
			for Filter in Filters['Sex']:
				if CountriesData[Country][NormalizingFactor] != 'null':
					CountriesData[Country][PureMeasure+' per '+NormalizingFactor+'|'+Filter] = float(CountriesData[Country][PureMeasure+'|'+Filter])/float(CountriesData[Country][NormalizingFactor])
				else:
					CountriesData[Country][PureMeasure+' per '+NormalizingFactor+'|'+Filter] = 'null'
			for Filter in Filters['Sport']:
				if CountriesData[Country][NormalizingFactor] != 'null':
					CountriesData[Country][PureMeasure+' per '+NormalizingFactor+'|'+Filter] = float(CountriesData[Country][PureMeasure+'|'+Filter])/float(CountriesData[Country][NormalizingFactor])
				else:
					CountriesData[Country][PureMeasure+' per '+NormalizingFactor+'|'+Filter] = 'null'

jsonOut = '{'
for Country in CountriesData:
	jsonOut += '"'+Country+'":{'
	for Measure in CountriesData[Country]:
		jsonOut += '"'+Measure+'":'+str(CountriesData[Country][Measure])+', '
	jsonOut = jsonOut[0:-2] + '},\n'

jsonOut = jsonOut[0:-2] + '}'

fout = open('data_joined_w_filter.json', 'w')
fout.write(jsonOut)
fout.close()














