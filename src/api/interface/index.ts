// * 请求响应参数(不包含data)
export interface Result {
  code: string
  msg: string
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
  data: T
}

// * 分页响应参数（统一参数名为pageNum/pageSize，与后端匹配）
export interface ResPage<T> {
  list: T[]
  pageNum: number // 原page -> 改为pageNum
  pageSize: number // 原limit -> 改为pageSize
  total: number
}

// * 分页请求参数（统一参数名）
export interface ReqPage {
  pageNum: number // 原page -> 改为pageNum
  pageSize: number // 原limit -> 改为pageSize
}

// * 登录模块
export namespace Login {
  export interface ReqLoginForm {
    account: string
    password: string
  }
  export interface ResLogin {
    access_token: string
  }
}

// * 管理员管理模块
export namespace SysManager {
  export interface ReqGetManagerParams extends ReqPage {
    account?: string
  }
  export interface ResManagerList {
    id: number
    account: string
    status: number
    createTime: string
  }
  export interface ReqEditManagerParams {
    id?: number
    account: string
    status: number
    roleId: number
    password?: string
  }

  export interface ReqEditPasswordParams {
    password?: string
    code?: string
  }
}

// * 角色模块
export namespace SysRole {
  export interface ReqGetRoleParams extends ReqPage {
    name?: string
  }
  export interface ResRoleList {
    id: number
    name: string
    remark: string
    menuIds: number[]
    createTime: string
  }
  export interface ReqEditRoleParams {
    id?: number
    name: string
    remark: string
    menuIds: number[]
  }
}

// * 菜单模块
export namespace SysMenu {
  // 移除重复的ReqLoginForm（与Login模块冲突）
  export interface ResMenuList {
    title: string
    id: number
    pid: number
    path: string
    name: string
    icon: string
    component?: string
    type: 'MENU_DIR' | 'MENU' | 'BUTTON'
    openType: 'TAB' | 'URL'
    url?: string
    auth?: string
    keepalive: boolean
    sort: number
    parentName: String
    children: ResMenuList[]
    hide?: boolean
  }
}

// * 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string
  }
}

export namespace Forum {
  export interface Post {
    nickname: string
  }
}

// * 操作日志模块
export namespace SysOperLog {
  // 日志查询参数（继承修正后的ReqPage）
  export interface ReqOperLogParams extends ReqPage {
    operName?: string
    operType?: number
    status?: number
    startTime?: string
    endTime?: string
  }

  // 日志列表项
  export interface ResOperLogList {
    id: number
    title: string
    operType: number
    operName: string
    operTime: string
    operIp: string
    operLocation: string
    status: number
    errorMsg?: string
    operUrl?: string
    requestMethod?: string
    operParam?: string
    jsonResult?: string
    costTime?: number
  }
}

// * 客户统计模块（将TradeArray移出SysOperLog，作为全局类型）
export interface TradeArray {
  timeList: string[]
  countList: number[] // 移除可选符，确保必须有该字段
}