select username, (
    (case when age=20 then 0 else 1 end) +
    (case when gender='m' then 0 else 1 end) +
    (case when native_country='india' then 0 else 1 end) +
    (case when skill_rankings=4 then 0 else 1 end) +
    (case when topic_interests='')
    ) as sim
from students, skill_rankings, topic_interests;
