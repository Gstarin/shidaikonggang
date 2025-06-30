import LeaderLine from './leader-line.min'
export function createLine(startEle,endEle,styleOption{
    return new LeaderLine(startEle,endEle,{
    ...styleOption
    })
}
