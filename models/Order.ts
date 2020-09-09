export default interface Order {
  date: Date;
  job: string; // 任务号
  customer: string; // 客户名称
  project: string; // 工程名称
  strenth: string; // 强度
  position: string; // 施工部位
  transport: string; // 输送方式
  machinesandno1: number; // 1#机制砂
  yellosandno2: number; // 2#黄沙
  smallstoneno3: number; // 3#小石子
  slicesstoneno4: number; // 4#瓜子片
  cementno1: number; // 1#水泥
  cementno2: number; // 2#水泥
  flyAshno3: number; // 3#粉煤灰
  slagPowderno4: number; // 4#狂风
  water: number; // 水
  admixtureno1: number; // 1#外加剂
  admixtureno2: number; // 2#外加剂
  cementno5: number; // 5#水泥
  sewage: number; // 污水
  bigstoneno6: number; // 6#大中石
  consumption: number; // 总消耗
  cans: number; // 罐数
  numOfcars: number; // 车次
  volume: number; // 方量
  createTime: Date;
  updateTime: Date;
  projcetId?: string; // 所属工程项目ID
  salesVolume?: number; // 销售方量
  delivery?: { $oid: string }[];
}
