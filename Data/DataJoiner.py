#!/usr/bin/python
import csv
import json
# Read in csv's and join.

CountriesData = {}

SportGroupings = {"Athletics":["Athletics","Athletics, Triathlon", "Triathlon"], "Cycling":["Cycling","Cycling", "Cycling - BMX", "Cycling - BMX, Cycling - Track", "Cycling - Mountain Bike", "Cycling - Mountain Bike, Cycling - Road", "Cycling - Mountain Bike, Cycling - Road, Cycling - Track", "Cycling - Mountain Bike, Cycling - Track", "Cycling - Road", "Cycling - Road, Cycling - Track", "Cycling - Track"], "Combat Sports":["Boxing", "Judo", "Taekwondo", "Wrestling", "Fencing", "Shooting", "Archery", "Weightlifting"], "Team Sports": ["Basketball", "Volleyball", "Water Polo", "Football", "Handball", "Hockey", "Beach Volleyball"], "Boats": ["Rowing", "Sailing", "Canoe Slalom", "Canoe Sprint"], "Aquatics": ["Diving", "Swimming", "Synchronised Swimming"], "Gymnastics": ["Gymnastics - Artistic", "Gymnastics - Rhythmic", "Trampoline"], "Racket Sports": ["Badminton", "Table Tennis", "Tennis"]}

#print SportGroupings
#for group in SportGroupings:
#	print group

CountryGroupMedals = {}
CountryGroupAthletes = {}

Sport2Group = {}
for Group in SportGroupings:
	for Sport in SportGroupings[Group]:
		Sport2Group[Sport] = Group

GroupTotalMedals = {}
for Group in SportGroupings:
	GroupTotalMedals[Group] = 0.0

GroupTotalAthletes = {}
for Group in SportGroupings:
	GroupTotalAthletes[Group] = 0.0

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

lowerVariables = ["Population", "GDP (current US$)", "GDP per capita (current US$)", "GINI index", "GNI per capita,  PPP (current international $)", "GNI per capita Atlas method (current US$)"]
upperVariables = []
for PureMeasure in PureMeasures:
	upperVariables.append(PureMeasure)
	for NormalizingFactor in NormalizingFactors:
		upperVariables.append(PureMeasure+' per '+NormalizingFactor)
MenuFilters = []
for Filter in Filters['Sex']:
	MenuFilters.append(Filter)
for Filter in Filters['Sport']:
	MenuFilters.append(Filter)

StructOut = '{"upperVariables": ['
for upperVariable in upperVariables:
	StructOut += '"'+upperVariable+'", '
StructOut = StructOut[0:-2]+'], "lowerVariables": ['
for lowerVariable in lowerVariables:
	StructOut += '"'+lowerVariable+'", '
StructOut = StructOut[0:-2]+'], "Filters": ['
for Filter in MenuFilters:
	StructOut += '"'+Filter+'", '
StructOut = StructOut[0:-2]+']}'
DropDownStructOut = open('DropVariables.json','w')
DropDownStructOut.write(StructOut)
DropDownStructOut.close()

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
			if Country not in CountryGroupMedals:
				CountryGroupMedals[Country] = {}
				CountryGroupAthletes[Country] = {}
				for Group in SportGroupings:
					CountryGroupMedals[Country][Group] = 0.0
					CountryGroupAthletes[Country][Group] = 0.0

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

		if AthleteSport in Sport2Group:
			CountryGroupMedals[Country][Sport2Group[AthleteSport]] += AthleteMedals
			CountryGroupAthletes[Country][Sport2Group[AthleteSport]] += 1.0
			GroupTotalMedals[Sport2Group[AthleteSport]] += AthleteMedals
			GroupTotalAthletes[Sport2Group[AthleteSport]] += 1.0
		
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
	#print Country, jsonOut[0:-2] + '}}'
	#blah = jsonOut[0:-2] + '}}'
	#bacon = json.loads(blah)
	jsonOut = jsonOut[0:-2] + '}, '

jsonOut = jsonOut[0:-2] + '}'
#blah = json.loads(jsonOut)
fout = open('data_joined_w_filter.json', 'w')
fout.write(jsonOut)
fout.close()


jsonOutMedals = '{'
jsonOutMedalsPCT = '{'
for Country in CountryGroupMedals:
	jsonOutMedals += '"'+Country+'":{'
	jsonOutMedalsPCT += '"'+Country+'":{'
	for Group in CountryGroupMedals[Country]:
		jsonOutMedals += '"'+Group+'":'+str(CountryGroupMedals[Country][Group])+', '
		jsonOutMedalsPCT += '"'+Group+'":'+str(CountryGroupMedals[Country][Group]/GroupTotalMedals[Group])+', '
	jsonOutMedals = jsonOutMedals[0:-2] + '}, '
	jsonOutMedalsPCT = jsonOutMedalsPCT[0:-2] + '}, '
jsonOutMedals = jsonOutMedals[0:-2] + '}'
jsonOutMedalsPCT = jsonOutMedalsPCT[0:-2] + '}'

fout = open('spiderMedals.json', 'w')
fout.write(jsonOutMedals)
fout.close()

fout = open('spiderMedalsPCT.json', 'w')
fout.write(jsonOutMedalsPCT)
fout.close()

jsonOutAthletes = '{'
jsonOutAthletesPCT = '{'
for Country in CountryGroupAthletes:
	jsonOutAthletes += '"'+Country+'":{'
	jsonOutAthletesPCT += '"'+Country+'":{'
	for Group in CountryGroupAthletes[Country]:
		jsonOutAthletes += '"'+Group+'":'+str(CountryGroupAthletes[Country][Group])+', '
		jsonOutAthletesPCT += '"'+Group+'":'+str(CountryGroupAthletes[Country][Group]/GroupTotalAthletes[Group])+', '
	jsonOutAthletes = jsonOutAthletes[0:-2] + '}, '
	jsonOutAthletesPCT = jsonOutAthletesPCT[0:-2] + '}, '
jsonOutAthletes = jsonOutAthletes[0:-2] + '}'
jsonOutAthletesPCT = jsonOutAthletesPCT[0:-2] + '}'

fout = open('spiderAthletes.json', 'w')
fout.write(jsonOutAthletes)
fout.close()

fout = open('spiderAthletesPCT.json', 'w')
fout.write(jsonOutAthletesPCT)
fout.close()













