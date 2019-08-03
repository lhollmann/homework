use sakila;
select first_name, last_name from actor;
select upper(concat(first_name, " ", last_name)) as "Actor Name" from actor;

select first_name, last_name, actor_id from actor where first_name = "Joe";
select first_name, last_name, actor_id from actor where last_name like "%GEN%";
select first_name, last_name, actor_id from actor where last_name like "%LI%" order by last_name, first_name;
select country, country_id from country where country in ("Afghanistan", "Bangladesh", "China");

alter table actor add Description blob;
alter table actor drop column Description;

select last_name, count(last_name) as "number_of_names" from actor group by last_name having "number_of_names" >=1;
select last_name, count(last_name) as "number_of_names" from actor group by last_name having "number_of_names" >=2;
update actor set first_name = "HARPO" where first_name = "GROUCHO" and last_name = "WILLIAMS";
update actor set first_name = "GROUCHO" where first_name = "HARPO" and last_name = "WILLIAMS";

show create table address;

select staff.first_name, staff.last_name, staff.address_id, address.address_id from staff inner join address on staff.address_id = address.address_id;
select staff.first_name, staff.last_name, sum(payment.amount) from staff inner join payment on staff.staff_id = payment.staff_id where month(payment.payment_date) = 08 and year(payment.payment_date) = 2005 group by staff.staff_id;
select film.title, count(film_actor.actor_id) from film_actor inner join film on film.film_id = film_actor.film_id group by film.title;
select title, count(inventory_id) from film inner join inventory using (film_id) where title = "Hunchback Impossible" group by title;
select customer.first_name, customer.last_name, sum(payment.amount) from customer inner join payment on customer.customer_id = payment.customer_id group by customer.customer_id order by customer.last_name;

select title from film where title like "%K%" or title LIKE "%Q%" and language_id in ( select language_id from language where name = "English" );
select first_name, last_name from actor where actor_id in ( select actor_id from film_actor where film_id = ( select film_id from film where title = "Alone Trip" ) );
select first_name, last_name, email, country from customer inner join address on (customer.address_id = address.address_id) inner join city on (address.city_id = city.city_id) inner join country on (city.country_id = country.country_id) where city.country_id = "canada";
select title, category.name from film inner join film_category on film.film_id = film_category.film_id inner join category on category.category_id = film_category.category_id where name = "family";
select title, count(title) from film inner join inventory on film.film_id = inventory.film_id inner join rental on inventory.inventory_id = rental.inventory_id group by title order by count(title) desc;
select store.store_id, sum(amount) from payment inner join rental on payment.rental_id = rental.rental_id inner join inventory on inventory.inventory_id = rental.inventory_id inner join store on store.store_id = inventory.store_id group by store.store_id;
select store_id, country from store inner join address on store.address_id = address.address_id inner join city on city.city_id = address.city_id inner join country on city.country_id = country.country_id;
select category.name, sum(amount) from payment inner join rental on payment.rental_id = rental.rental_id inner join inventory on rental.inventory_id = inventory.inventory_id inner join film_category on inventory.film_id = film_category.film_id inner join category on film_category.category_id = category.category_id group by category.name order by sum(amount) desc;

create view top_five_genres as select category.name, sum(amount) from payment inner join rental on payment.rental_id = rental.rental_id inner join inventory on rental.inventory_id = inventory.inventory_id inner join film_category on inventory.film_id = film_category.film_id inner join category on film_category.category_id = category.category_id group by category.name order by sum(amount) desc limit 5;
select * from top_five_genres;
drop view top_five_genres;