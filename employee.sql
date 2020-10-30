--this is the view I created in mysql to format and select from joined tables.

create view emp_data AS
 SELECT distinct
        CONCAT(`e`.`first_name`, ' ', `e`.`last_name`) AS `Employee`,
        `r`.`title` AS `Role`,
        `d`.`name` AS `Dept`
    FROM
        (`employee`.`department` `d`
        JOIN (`employee`.`roles` `r`
      left  JOIN `employee`.`employees` `e` ON ((`r`.`role_id` = `e`.`role_id`))))
    WHERE
        (`e`.`dept_id` = `d`.`dept_id`)
        



select * from emp_data
where role = 'Manager'






select sum(roles.salary), employees.role_id, roles.role_id, roles.dept_id, department.dept_id, department.name
from employees, roles, department
where employees.role_id =roles.role_id
and roles.dept_id = department.dept_id
group by department.name;