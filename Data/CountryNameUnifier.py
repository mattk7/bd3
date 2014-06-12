#!/usr/bin/python
import csv

ReferenceTableLines = open('MisMatchReferenceTable.txt','r').readlines()

ReferenceTable = {}
for line in ReferenceTableLines[1:]:
	OlyName = line.replace('\n','').split('\t')[0]
	WBName = line.replace('\n','').split('\t')[1]
	ReferenceTable[OlyName] = WBName


olyOut = open('olympics_2012_Clean.csv', 'w')
oly_rows = csv.reader(open('olympics_2012.csv', 'r'), delimiter=',', quotechar='"')
olyOutwriter = csv.writer(olyOut, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
olyCountries = {}
for row in oly_rows:
	OlyName = row[1]
	if OlyName in ReferenceTable:
		if ReferenceTable[OlyName] != '****':
			row[1] = ReferenceTable[OlyName]
			olyOutwriter.writerow(row)
			olyCountries[ReferenceTable[OlyName]] = 1
	else:
		olyCountries[OlyName] = 1
		olyOutwriter.writerow(row)
olyOut.close()

WBOut = open('WBData_Clean.csv', 'w')
WB_lines = open('WBData.csv', 'r').readlines()
WB_rows = csv.reader(open('WBData.csv', 'r'), delimiter=',', quotechar='"')
WBOutwriter = csv.writer(WBOut, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
WBOut.write(WB_lines[0])
WBCountries = {}
for row in WB_rows:
	WBName = row[2]
	if WBName in olyCountries:
		WBOutwriter.writerow(row)
		WBCountries[WBName] = 1
WBOut.close()

print len(olyCountries), len(WBCountries)
for country in olyCountries:
	if country not in WBCountries:
		print country

