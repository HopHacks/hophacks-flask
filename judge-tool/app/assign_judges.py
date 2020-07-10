import csv
import math
import random
import os

def assign_judges(judges_file, submissions_file, judges_per_team):
    script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
    rel_path_j = "uploads/" + judges_file
    rel_path_s = "uploads/" + submissions_file
    abs_file_path_j = os.path.join(script_dir, rel_path_j)
    abs_file_path_s = os.path.join(script_dir, rel_path_s)
    with open(abs_file_path_j, "r") as judges_list, \
        open(abs_file_path_s, "r", encoding="utf-8") as submissions_list:

        submissions_reader = csv.reader(submissions_list, delimiter=',')
        judges = [line[:-1] for line in judges_list] #list to store judges
        submissions = [] #list to store submissions

        next(submissions_reader)
        for row in submissions_reader:
            submissions.append(row[0]) #populate submissions list

        random.Random(0).shuffle(submissions) #randomize order of submissions

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
