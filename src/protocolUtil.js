export default{
    checkCtrl(value,ctrlPtl){
        return (value & ~0xf)==ctrlPtl;
    },
    checkState(value,statePtl){
        return (value & 0xf)== statePtl
    },
    createFrame(ptl,data,addition){
        return {
            protocol:ptl,
            data:data,
            addition:addition
        }
    }
}