

select e.first_name, e.last_name, r.title, d.name
from department d, role r
join employees e on r.role_id = e.role_id
where r.dept_id = d.dept_id
group by e.first_name, e.last_name
order by d.name, e.last_name;

