library(ggplot2)
library(reshape)
library(data.table)
library(plyr)

WBdata <- read.csv('Data/WBData_Clean.csv', header=T, 
                   colClasses=c(NA, "NULL", NA, NA, rep("NULL",12), "numeric"))

colnames(WBdata) <- c('GDPDef', 'Country', 'CountryCode', 'GDP')

OLY2012 <- read.csv('Data/olympics_2012_Clean.csv', header=T, 
                    colClasses=c(rep(NA,9), rep("numeric",3)))

population <- WBdata[WBdata$GDPDef=="Population (Total)",]
colnames(population)[4] <- "Population"

temp <- ddply(OLY2012, .(Country), summarize, 
                              totalAthletes=length(Country), 
                              totalMedals=sum(Gold, Silver,Bronze, na.rm=T),
                              medalsAthlRatio=sum(Gold, Silver,Bronze, na.rm=T)/length(Country)
                              )

olydata <- merge(population,temp,by="Country")

olydata$medalsPopRatio <- olydata$totalMedals/olydata$Population
olydata$medalsLogPopRatio <- olydata$totalMedals/log10(olydata$Population)

olydata$athlPopRatio <- olydata$totalAthletes/olydata$Population
olydata$athlLogPopRatio <- olydata$totalAthletes/log10(olydata$Population)

olydata$GDPDef <- NULL



