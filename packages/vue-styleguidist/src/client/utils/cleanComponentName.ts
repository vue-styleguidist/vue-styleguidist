// this function is duplicated becasue babel 7 is very unfriendly to es5 exports
// before you merge both of them, make sure you try it with and without the cli plugin
export default (displayName: string) => displayName.replace(/[^A-Za-z0-9-]/g, '')
