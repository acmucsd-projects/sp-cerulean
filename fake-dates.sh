#!/bin/bash

print_date() {
	local month=$1
	local date=$2
	local start_time=$3
	local end_time=$4
	echo "{"
	echo -e "\"start\": \"2020-${month}-${date}T${start_time}:00.000-0800\","
	echo -e "\"end\": \"2020-${month}-${date}T${end_time}:00.000-0800\""
	echo "}"
}

first=1

echo "["
while read -r line; do
	(( first )) || echo "," 
	first=0
	print_date $line
done < fake-dates.txt
echo "]"
