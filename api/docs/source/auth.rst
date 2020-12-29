Authentication API
================================================
Login, Logout, and Session related endpoints

`Offcial Website for JWT <JWT https://jwt.io/introduction/>`_.

`Guide for the basic idea of storing JWTs on the frontend
<https://hasura.io/blog/best-practices-of-using-jwt-with-graphql>`_.


.. autoflask:: app:create_app('../src/config/config.json')
    :blueprints: auth
    :undoc-static:
