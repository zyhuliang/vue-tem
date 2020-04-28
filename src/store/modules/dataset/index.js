import { dataset } from '../../mutation-types/index';

const datasetData = {
    state:{
        musestatus:0
    },
    mutations:{
        [dataset.MUSESTATUS_DATA](state, data) {
            state.musestatus = data;
          },
    }
}
export default datasetData;