
import MongoClient from 'mongodb';
import {DefaultSchemas} from "../data/default_schema";
import atob from 'atob';
export class SchemaController{
    constructor(params){
        this.collection = params.collection;
    }
    async upload(data,collection_name){
        if(!this.db) await this.connectDb();
        try{
            let split_data = atob(data.data).split("\n");
            let header = split_data.shift();
            let columns = header.split(',');
            let insert_many =[];
            split_data.forEach((row, index)=>{
                let cols = row.split(',');
                if(row === '' || cols.length !== columns.length) return;
                let obj = {};

                columns.forEach((column, c_index)=>{
                    obj[column] = cols[c_index];
                });
                insert_many.push(obj);
            });
            let inserted = await this.db.collection(collection_name || this.collection).insertMany(insert_many);
            return inserted;
        }catch(e){
            console.log(e.toString());
            return {};
        }
    }
    async schema(collection_name){
        if(!this.db) await this.connectDb();
        try{
            let defaultSchema = DefaultSchemas.getDefault(collection_name);
            if(defaultSchema) return defaultSchema;
            let def =  await this.db.collection("tables").findOne({table_name:collection_name || this.collection}) || {};
            console.log("fields", def.fields);
            def.fields = await this.db.collection("fields").find({"_id": { $in:  def["fields"].map(item => new MongoClient.ObjectID(item) ) }}).toArray();
            return def;
        }catch(e){
            console.log(e.toString());
            return {};
        }

    }
    async getRecords(query,collection_name){
        if(!this.db) await this.connectDb();
        try{
            if(query.filter && query.filter._id !== undefined)
                query.filter._id = new MongoClient.ObjectID(query.filter._id);
            let skip = 0;
            let pageSize = 20;
            let sort = {};
            if(query.sort){
                Object.keys(query.sort).forEach((key) => {
                  if(query.sort[key] === "asc")
                      sort[key] = -1;
                  else
                      sort[key] = 1;
                });
            }
            if(query.page){
                skip = pageSize * (query.page - 1);
            }
            Object.keys(query.filter || {}).forEach((obj)=>{
                if(query.filter[obj] === 'true')
                    query.filter[obj] = true;
                if(query.filter[obj] === 'false')
                    query.filter[obj] = false;
            })
            console.log("filter", query.filter);
            let result =  await this.db.collection(collection_name || this.collection).find(query.filter).sort(sort).skip(skip).limit(20).toArray();
            let count = await this.db.collection(collection_name || this.collection).count(query.filter);
            return {data:result, count:count, page:query.page, page_size: pageSize};
        }catch(e){
            console.log(e.toString());
            return [];
        }
    }
    async getById(id,collection_name, query){
        if(!this.db) await this.connectDb();
        try{
            let res = (await this.db.collection(collection_name || this.collection).findOne({ "_id":  new MongoClient.ObjectID(id)  }));
            if(query.expand){
                let pieces = query.expand.split(',');
                for(let i=0;i<pieces.length;i++ ){
                    try{
                        res[pieces[i]]=  await this.db.collection(pieces[i]).find({"_id": { $in:  res[pieces[i]].filter(item => item._id === undefined).map(item => new MongoClient.ObjectID(item) ) }}).toArray()
                    }catch(e){
                        console.log(e.toString());
                    }
                }
            }
            return res;
        }catch(e){
            console.log(e.toString());
            return {};
        }
    }
    async add(data, collection_name){
        if(!this.db) await this.connectDb();
        try{

            let inserted = await this.db.collection(collection_name || this.collection).insertOne(data);
            if(data.parent_collection &&  data.parent_id){
                let parent = await this.db.collection(data.parent_collection).findOne({"_id":new MongoClient.ObjectID(data.parent_id) });
                parent[collection_name] = parent[collection_name] || [];
                parent[collection_name].push(data._id);
                await this.db.collection(data.parent_collection).save(parent);
            }
            return inserted;
        }catch(e){
            console.log(e.toString());
            return {};
        }
    }
    async update(id, data, collection_name){
        if(!this.db) await this.connectDb();
        try{
            let schema = await this.schema(collection_name || this.collection);
            if(schema.child_collection){
                 delete data[schema.child_collection.table_name];
            }
            delete data._id;
            return this.db.collection(collection_name || this.collection).updateOne({"_id":new MongoClient.ObjectID(id)}, data);
        }catch(e){
            console.log(e.toString());
            return {};
        }
    }
    async patch(id, data, collection_name){
        if(!this.db) await this.connectDb();
        try{
            let schema = await this.schema(collection_name || this.collection);
            if(schema.child_collection){
                delete data[schema.child_collection.table_name];
            }
            delete data._id;
            return this.db.collection(collection_name || this.collection).updateOne({"_id":new MongoClient.ObjectID(id)}, {$set: data} )
        }catch(e){
            console.log(e.toString());
            return {};
        }
    }
    async deleteOne(id, collection_name){
        if(!this.db) await this.connectDb();
        try{
            return this.db.collection(collection_name || this.collection).remove({"_id":new MongoClient.ObjectID(id)});
        }catch(e){
            console.log(e.toString());
            return {};
        }
    }
    async connectDb(){
        var url = "mongodb://localhost:27017/site_builder";
        this.db = await MongoClient.connect(url);
    }
}