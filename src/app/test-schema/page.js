
import { checkStudentSchema } from '@/app/actions';

export default async function TestSchema() {
    const schema = await checkStudentSchema();
    return <pre>{JSON.stringify(schema, null, 2)}</pre>;
}
