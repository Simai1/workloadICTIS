const positions = {
    Ассистент: 0,
    'Ведущий научный сотрудник': 1,
    'Главный научный сотрудник': 2,
    'Директор института': 3,
    Доцент: 4,
    'Научный сотрудник': 5,
    Профессор: 6,
    'Старший научный сотрудник': 7,
    'Старший преподаватель': 8,
    Преподаватель: 9,
};

export default positions;
export const map = Object.keys(positions).reduce(
    (acc, k) => ({
        ...acc,
        [positions[k]]: k,
    }),
    {}
);
