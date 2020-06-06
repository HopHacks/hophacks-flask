.. Hophacks Website API documentation master file, created by
   sphinx-quickstart on Thu Jun  4 19:26:21 2020.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to Hophacks Website API's documentation!
================================================

.. toctree::
   :maxdepth: 2
   :caption: Contents:


.. autoflask:: app:create_app('../src/config/settings.json')
    :include-empty-docstring:
    :blueprints: accounts
    :undoc-static:
