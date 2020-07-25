import math
import random
import csv

def assign_judges(judges, submissions, judges_per_team):
    assignments = {} #dictionary of judge-submission assignments

    for judge in judges:
        assignments[judge] = [] #make dictionary keys

    i = 0
    judges_length = len(judges)
    rotate = float(judges_length / judges_per_team) #how many to rotate judges array by
    while i < judges_per_team:
        judge_index = judges_length - (math.ceil(i * rotate) % judges_length) #for indexing through judges list
        for s in submissions:
            #go through all the submissions once per loop
            if judge_index == judges_length: #wrap around list if we've reached the end
                judge_index = 0
            current_judge = judges[judge_index]
            assignments[current_judge].append(s)
            judge_index += 1
        i += 1

    return assignments
