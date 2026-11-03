import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {parseCandidateSettings} from '@/engine/validation/candidate-settings';
export const dynamic='force-dynamic';
export async function GET(){try{const settings=JSON.parse(await readFile(path.join(process.cwd(),'data/candidate.json'),'utf8'));return Response.json({success:true,settings,...parseCandidateSettings(settings)},{headers:{'Cache-Control':'no-store'}});}catch(e){return Response.json({success:false,error:e instanceof Error?e.message:'Cannot read data/candidate.json'},{status:400});}}
