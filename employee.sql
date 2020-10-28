


select distinct e.first_name, e.last_name, r.title, r.salary, d.name 
from 
role r, 
department d,
join employees e
on r.role_id = e.role_id
where e.dept_id = d.dept_id
group by e.first_name, e.last_name
order by e.last_name;

