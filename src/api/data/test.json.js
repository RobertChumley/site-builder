{
    "data"
:
    {
        "_id"
    :
        "5a09e05afaca214edc0ea2de", "back_state"
    :
        {
            "path"
        :
            "System#Tables"
        }
    ,
        "table_name"
    :
        "test", "fields"
    :
        [{
            "_id": "5a132b8f37daf914f4fe5c85",
            "parent_collection": "tables",
            "parent_id": "5a09e05afaca214edc0ea2de",
            "back_state": {
                "path": "System#NewTable",
                "route_params": {"filter": {"_id": "5a09e05afaca214edc0ea2de"}, "expand": ["fields"]},
                "parent_data": {"back_state": {"path": "System#Tables"}}
            },
            "field_name": "tests",
            "field_code": "test",
            "data_type": {"value": "string", "display": "String"},
            "link_field": "_id",
            "link": "test#Newtest"
        }, {
            "_id": "5a132c7337daf914f4fe5c86",
            "parent_collection": "tables",
            "parent_id": "5a09e05afaca214edc0ea2de",
            "back_state": {
                "path": "System#NewTable",
                "route_params": {"filter": {"_id": "5a09e05afaca214edc0ea2de"}, "expand": ["fields"]},
                "parent_data": {"back_state": {"path": "System#Tables"}}
            },
            "field_name": "blah",
            "data_type": {"value": "pick_list", "display": "Pick List"},
            "field_code": "blah",
            "options": [{"display": "option1", "value": "option1"}, {"display": "options2", "value": "option2"}]
        }], "system_label"
    :
        "Test"
    }
,
    "schema_def"
:
    {
        "table_title"
    :
        "Tables", "table_name"
    :
        "tables", "child_collection"
    :
        {
            "table_name"
        :
            "fields", "title"
        :
            "Fields", "routes"
        :
            [{"route_key": "add", "route_dest": "System#NewField"}], "fields"
        :
            [{
                "link": "System#NewField",
                "link_field": "_id",
                "field_name": "Field Name",
                "data_type": "string",
                "field_code": "field_name"
            }, {
                "field_name": "Field Type",
                "data_type": "pick_list",
                "field_code": "data_type",
                "options": [{"value": "string", "display": "String"}, {
                    "value": "text",
                    "display": "Text"
                }, {"value": "pick_list", "display": "Pick List"}, {
                    "value": "number",
                    "display": "Number"
                }, {"value": "money", "display": "Money"}, {"value": "url", "display": "Url"}]
            }, {
                "field_name": "Field Code",
                "data_type": "string",
                "field_code": "field_code"
            }, {"field_name": "Link Field", "data_type": "string", "field_code": "link_field"}, {
                "field_name": "Link",
                "data_type": "string",
                "field_code": "link"
            }]
        }
    ,
        "fields"
    :
        [{
            "link": "System#NewTable",
            "link_field": "_id",
            "field_name": "Table Name",
            "data_type": "string",
            "field_code": "table_name"
        }, {"field_name": "System Label", "data_type": "string", "field_code": "system_label"}]
    }
}