create table if not exists added_movie(
     id serial primary key,
     title varchar(300),
     overview varchar(10000)

)