import {dto} from './{dtoName}';
import ROUTES from './{routesName}';
import Request from '../../Requests/Request';

export default class {clientServiceName} {
   static async createDTO({props}) {
      return new {dto}(
         {props}
      ).getDTO();
   }

   static async getList() {
      return await Request.get(ROUTES.GET)
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }
   static async getById(id) {
      return await Request.get(ROUTES.GET_BY_ID + id)
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }

    static async query({queryProps}) {
       
      let ask = '';

      for (let i = 0; i < arguments.length; i++) {
         if (arguments[i] !== null) {
            ask += i + '&';
         }
      }
      ask = ask.slice(0, ask.length - 1);

      return await Request.get(ROUTES.QUERY + ask)
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }

   static async create({name}) {
      return await Request.post(ROUTES.CREATE, {name})
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }

   static async updateEmployee({name}) {
      return await Request.put(ROUTES.UPDATE, {name})
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }

   static async deleteById(id) {
      return await Request.delete(
         ROUTES.DELETE_BY_ID + id
      )
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }
}