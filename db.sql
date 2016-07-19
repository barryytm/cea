DROP SCHEMA IF EXISTS cea CASCADE;
CREATE SCHEMA cea;

SET SEARCH_PATH TO cea;

CREATE TYPE gen_type AS ENUM ('male', 'female', 'other');
CREATE TYPE time_type AS ENUM ('morning', 'afternoon', 'evening');
CREATE TYPE grade_type AS ENUM ('A', 'B', 'C', 'D', 'F');

CREATE DOMAIN five_level AS int CHECK (VALUE BETWEEN 1 AND 5);

CREATE TABLE departments(
    dept_code char(3) PRIMARY KEY,
    dept_name varchar(30)
);

CREATE TABLE courses(
    course_id int PRIMARY KEY,
    dept_code char(3),
    course_number int,
    course_name varchar(30)
);

CREATE TABLE course_editions(
    edition_id int PRIMARY KEY,
    course_id int,
    year int,
    semester char(1),
    total_students int,
    time_day time_type
);

CREATE TABLE students(
    username varchar(30) PRIMARY KEY,
    permission varchar(30),
    age int,
    gender gen_type,
    native_country varchar(30)
);

CREATE TABLE skills(
    skill_id int PRIMARY KEY,
    skill varchar(30)
);

CREATE TABLE topics(
    topics_id int PRIMARY KEY,
    topics varchar(30)
);

CREATE TABLE course_topics(
    topics_id int,
    course_id int,
    PRIMARY KEY(topics_id, course_id)
);

CREATE TABLE course_skills(
    skill_id int,
    course_id int,
    PRIMARY KEY(skill_id, course_id)
);

CREATE TABLE enrollments(
    username varchar(30),
    edition_id int,
    letter_grade char(1),
    course_ranking five_level,
    instr_ranking five_level
    PRIMARY KEY(username, edition_id)
);

CREATE TABLE skill_rankings(
    username varchar(30),
    edition_id int,
    course_id int,
    skill_id int,
    rank_before five_level,
    rank_after five_level
    PRIMARY KEY(username, edition_id, skill_id)
);

CREATE TABLE topic_interests (
    username varchar(30),
    edition_id int,
    course_id int,
    topics_id int,
    interest_before five_level,
    interest_after five_level
);

CREATE TABLE letter_grade(
    letter_grade char(1),
    min_grade char (1),
    max_grade char (1),
    gpa real
);
