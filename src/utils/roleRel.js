export function roleRel(roleNum) {
  switch (roleNum) {
    case 1:
      return '管理员';
    case 2:
      return '老师';
    case 3:
      return '学生'
  }
}