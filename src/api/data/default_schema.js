export class DefaultSchemas{
    static getDefault(schema_name){
        return DefaultSchemas.getSchemas()[schema_name];
    }
    static getSchemas(){
        return {
            "fields":{table_title:"Fields",
                table_name:"fields",
                routes:[{route_key:"add",route_dest:"System#NewField"}],
                fields: [ {
                        link:"System#NewField",
                        link_field: "_id",
                        field_name:"Field Name",
                        data_type:"string",
                        field_code:"field_name" },
                    {
                        field_name:"Field Type",
                        data_type:"pick_list",
                        field_code:"data_type",
                        options:[
                            {value:"string", display:"String"},
                            {value:"text", display:"Text"},
                            {value:"pick_list", display:"Pick List"},
                            {value:"reference", display:"Reference",dropin:"reference"},
                            {value:"number", display:"Number"},
                            {value:"money", display:"Money"},
                            {value: "url",display:"Url"}
                        ]
                    },
                    {
                        field_name:"Field Code",
                        data_type:"string",
                        field_code:"field_code"
                    },
                    {
                        field_name:"Link Field",
                        data_type:"string",
                        field_code:"link_field"
                    },
                    {
                        field_name:"Link",
                        data_type:"string",
                        field_code:"link"
                    }
                ]
            },
            "tables":{table_title:"Tables",
                table_name:"tables",
                child_collection: {table_name:"fields",title:"Fields",routes:[{route_key:"add",route_dest:"System#NewField"}]},
                fields: [ {
                    link:"System#NewTable",
                    link_field: "_id",
                    field_name:"Table Name",
                    data_type:"string",
                    field_code:"table_name" },
                    {

                        field_name:"System Label",
                        data_type:"string",
                        field_code:"system_label" },
                    {

                        field_name:"Has Child",
                        data_type:"checkbox",
                        field_code:"child" }
                ]
            },
            "external_apis":{
              table_title:"External APIs",
              fields:[
                  {
                      link:"System#NewApi",
                      link_field: "_id",
                      field_name:"Url",
                      data_type:"string",
                      field_code:"url" }
              ]
            },
            "reports":{
                table_title:"Reports",
                fields:[
                    {
                        link:"System#newReports",
                        link_field: "_id",
                        field_name:"Report Name",
                        data_type:"string",
                        field_code:"report_name" },
                    {

                        field_name:"On Dashboard",
                        data_type:"string",
                        field_code:"on_dashboard" }
                ]
            },
            "users":{table_title:"Users",
                table_name:"users",
                fields: [ {
                    link:"System#NewUser",
                    link_field: "_id",
                    field_name:"User Name",
                    data_type:"string",
                    field_code:"username" },
                    {

                        field_name:"First Name",
                        data_type:"string",
                        field_code:"first_name" },
                    {

                        field_name:"Last Name",
                        data_type:"string",
                        field_code:"last_name" },
                    {

                        field_name:"Password",
                        show:false,
                        data_type:"password",
                        field_code:"Password" },
                    {

                        field_name:"Password Confirm",
                        show:false,
                        data_type:"password",
                        field_code:"password_confirm" }
                ]
            }
        };
    }
}