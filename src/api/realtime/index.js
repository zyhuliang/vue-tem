import axios from 'axios';

let base = process.env.NODE_ENV == 'mock' ? '/mock' : '/api';

//flow
export const queryflow = (params) => {
	return axios.get(`${base}/rtc/flows/${params}`).then((res) => res);
}; //查询流程
export const delflow = (params) => {
	return axios.delete(`${base}/rtc/flows/${params.id}`).then((res) => res);
}; //删除流程
// export const listflow = (offset, limit) => {
//   return axios
//     .get(`${base}/rtc/flows/all?limit=${limit}&offset=${offset}`)
//     .then(res => res);
// }; //分页查询流程

export const listflow = (params) => {
	return axios.get(`${base}/rtc/flows/all?${params}`).then((res) => res);
}; //分页查询流程
export const createflow = (params) => {
	return axios.post(`${base}/rtc/flows/create`, params).then((res) => res);
}; //创建流程
export const modifyflow = (params) => {
	return axios.put(`${base}/rtc/flows/${params.id}`, params).then((res) => res);
}; //创建流程

//step
export const steplist = () => {
	return axios.get(`${base}/rtc/steps/all`).then((res) => res.data);
};
export const stepsettings = (params) => {
	return axios.get(`${base}/rtc/steps/settings/${params}`).then((res) => res.data);
};

//获取step输出字段
export const outputStep = (params) => {
	return axios.post(`${base}/rtc/steps/outputs`, params).then((res) => res);
};

//scheduler
export const queryscheduler = (params) => {
	return axios.get(`${base}/rtc/schedulers/${params}`).then((res) => res);
}; //查询调度
export const descheduler = (params) => {
	return axios.delete(`${base}/rtc/schedulers/${params}`).then((res) => res);
}; //删除调度
export const listscheduler = (offset, limit) => {
	return axios.get(`${base}/rtc/schedulers/all?limit=${limit}&offset=${offset}`).then((res) => res);
}; //分页s所有调度
export const creatscheduler = (params) => {
	return axios.post(`${base}/rtc/schedulers/create`, params).then((res) => res);
}; //创建流程

export const runtimeSettings = (params) => {
	return axios.get(`${base}/rtc/executions/runtimeSettings`).then((res) => res);
}; //获取任务运行时可配置参数

export const delexecutions = (params) => {
	return axios.delete(`${base}/rtc/executions/${params}`).then((res) => res);
};

export const listexecutions = (val) => {
	return axios.get(`${base}/rtc/executions/all?${val}`).then((res) => res);
};

export const executionsStart = (params) => {
	return axios.post(`${base}/rtc/executions/${params}/start`).then((res) => res);
};

export const executionsStop = (params) => {
	return axios.post(`${base}/rtc/executions/${params}/stop`).then((res) => res);
};

export const savepoint = (val) => {
	return axios.get(`${base}/rtc/executions/${val}/savepoint`).then((res) => res);
};

export const getLogtail = (val) => {
	return axios.get(`${base}/rtc/executions/${val.id}/logs/tail?absolutePath=${val.absolutePath}`).then((res) => res);
};

export const getLogabsolutePath = (val) => {
	return axios
		.get(`${base}/rtc/executions/${val.id}/logs/absolutePath?absolutePath=${val.absolutePath}`)
		.then((res) => res);
};

export const getLoglauncher = (val) => {
	return axios.get(`${base}/rtc/executions/${val}/logs/launcher`).then((res) => res);
};

export const getLogJob = (val) => {
	return axios
		.get(`${base}/rtc/executions/${val.id}/logs?logType=${val.logType}&applicationId=${val.applicationId}`)
		.then((res) => res);
};
///executions/{id}/logs/tail

// cep

//查询支持的连线类型
export const getCepLinks = (params) => {
	return axios.get(`${base}/rtc/cep/metadata/links`).then((res) => res);
};

//查询支持的事件类型
export const getCepEvents = (params) => {
	return axios.get(`${base}/rtc/cep/metadata/events`).then((res) => res);
};

//查询支持的连线类型
export const getCepSettings = (params) => {
	return axios.get(`${base}/rtc/cep/event/settings/link`).then((res) => res);
};

//查询事件支持的参数

export const getEventsSetting = (val) => {
	return axios.get(`${base}/rtc/cep/event/settings/${val.event}`).then((res) => res);
};

export const executionRestore = (params) => {
	return axios.post(`${base}/rtc/executions/${params.id}/restore`,params.body).then((res) => res); ///executions/{id}/restore
};


export const validate = (params) => {
	return axios.post(`${base}/rtc/steps/validate`,params).then((res) => res); ///executions/{id}/restore
};