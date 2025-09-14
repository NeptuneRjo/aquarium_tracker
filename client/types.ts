export type ParamNode = {
    created_at: Date,
    updated_at: Date,
    value: number,
    ulid: string
}

export type Param = {
    values: ParamNode[] | undefined,
    name: string,
    created_at: Date,
    updated_at: Date,
    unit: string,
    ulid: string,
    latest_value: number
}

export type Tank = {
    ulid: string,
    created_at: Date,
    updated_at: Date,
    name: string,
    description: string,
    params: Param[]
}

export type ApiResponse<DataType> = {
    status: number,
    message: string,
    data: DataType
}

