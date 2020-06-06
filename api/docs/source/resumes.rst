Resumes API
================================================

Note for all these requests, you need to provide authentication in the form of
an JWT token (ie. ``Authorization: Bearer <token>`` in the header of the request.
See the Authentication API for details.

Any reference to a 'current user' is referring to the user associated with the
given access token.

.. autoflask:: app:create_app('../src/config/settings.json')
    :blueprints: resumes
    :undoc-static:
