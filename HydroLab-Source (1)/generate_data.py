from rdkit import Chem
from rdkit.Chem import AllChem, Descriptors, rdMolDescriptors
import json, math
from pathlib import Path

items = [
    {"id":"methane","name":"Methane","formula":"CH4","smiles":"C","cid":297,"category":"alkane","nameFa":"متان","formulaFa":"CH₄","descEn":"The simplest alkane: one carbon atom bonded tetrahedrally to four hydrogen atoms.","descFa":"ساده‌ترین آلکان؛ یک اتم کربن با آرایش چهاروجهی به چهار اتم هیدروژن پیوند دارد.","factFa":"در متان، چهار پیوند C–H هم‌ارز هستند و زاویهٔ پیوندی ایده‌آل آن‌ها نزدیک به ۱۰۹٫۵ درجه است."},
    {"id":"ethane","name":"Ethane","formula":"C2H6","smiles":"CC","cid":6324,"category":"alkane","nameFa":"اتان","formulaFa":"C₂H₆","descEn":"A two-carbon alkane with a rotatable single bond between its carbon atoms.","descFa":"آلکانی دوکربنه که میان دو اتم کربن آن یک پیوند یگانهٔ قابل چرخش وجود دارد.","factFa":"پیوند یگانهٔ C–C امکان چرخش دارد؛ بنابراین اتان می‌تواند آرایش‌های فضایی متفاوتی بگیرد."},
    {"id":"propane","name":"Propane","formula":"C3H8","smiles":"CCC","cid":6334,"category":"alkane","nameFa":"پروپان","formulaFa":"C₃H₈","descEn":"A three-carbon saturated hydrocarbon with only carbon–carbon single bonds.","descFa":"هیدروکربنی سیرشده با سه اتم کربن که در آن همهٔ پیوندهای کربن–کربن یگانه‌اند.","factFa":"پروپان سه اتم کربن در یک زنجیر دارد و فرمول آلکان‌ها از رابطهٔ CₙH₂ₙ₊₂ پیروی می‌کند."},
    {"id":"butane","name":"Butane","formula":"C4H10","smiles":"CCCC","cid":7843,"category":"alkane","nameFa":"بوتان","formulaFa":"C₄H₁₀","descEn":"A straight-chain four-carbon alkane; rotation around C–C single bonds gives many conformations.","descFa":"آلکانی زنجیری با چهار اتم کربن؛ چرخش حول پیوندهای یگانهٔ C–C آرایش‌های فضایی گوناگونی ایجاد می‌کند.","factFa":"بوتان در این کتابخانه به صورت زنجیر مستقیم نمایش داده شده است؛ ایزومر شاخه‌دار آن، ایزوبوتان، مولکول جداگانه‌ای است."},
    {"id":"pentane","name":"Pentane","formula":"C5H12","smiles":"CCCCC","cid":8003,"category":"alkane","nameFa":"پنتان","formulaFa":"C₅H₁₂","descEn":"A five-carbon straight-chain alkane with four carbon–carbon single bonds.","descFa":"آلکانی زنجیری با پنج اتم کربن و چهار پیوند یگانهٔ کربن–کربن.","factFa":"در نمایش سه‌بعدی، زنجیر پنتان خمیده دیده می‌شود؛ این شکل به آرایش فضایی انتخاب‌شده وابسته است."},
    {"id":"hexane","name":"Hexane","formula":"C6H14","smiles":"CCCCCC","cid":8058,"category":"alkane","nameFa":"هگزان","formulaFa":"C₆H₁₄","descEn":"A six-carbon straight-chain alkane, the longest chain in this starter collection.","descFa":"آلکانی زنجیری با شش اتم کربن؛ طولانی‌ترین زنجیر در مجموعهٔ آغازین.","factFa":"هگزانِ این مجموعه n-هگزان است؛ نام n نشان می‌دهد زنجیر کربنی مستقیم است."},
    {"id":"ethene","name":"Ethene","formula":"C2H4","smiles":"C=C","cid":6325,"category":"alkene","nameFa":"اتن","formulaFa":"C₂H₄","descEn":"A two-carbon alkene containing one carbon–carbon double bond; the atoms around it are planar.","descFa":"آلکانی دوکربنه از خانوادهٔ آلکن‌ها که یک پیوند دوگانهٔ C=C دارد؛ اتم‌های پیرامون این پیوند تقریباً هم‌صفحه‌اند.","factFa":"پیوند دوگانه از یک پیوند σ و یک پیوند π تشکیل می‌شود و چرخش آزاد حول آن وجود ندارد."},
    {"id":"ethyne","name":"Ethyne","formula":"C2H2","smiles":"C#C","cid":6326,"category":"alkyne","nameFa":"اتین","formulaFa":"C₂H₂","descEn":"A two-carbon alkyne with a carbon–carbon triple bond and a linear molecular geometry.","descFa":"آلکاینی دوکربنه با پیوند سه‌گانهٔ C≡C و هندسهٔ مولکولی خطی.","factFa":"در اتین، هر اتم کربن هندسهٔ خطی دارد و زاویهٔ H–C–C برابر ۱۸۰ درجه است."},
    {"id":"propene","name":"Propene","formula":"C3H6","smiles":"CC=C","cid":8252,"category":"alkene","nameFa":"پروپن","formulaFa":"C₃H₆","descEn":"A three-carbon alkene with a terminal carbon–carbon double bond.","descFa":"آلکنی سه‌کربنه با یک پیوند دوگانهٔ انتهایی میان دو اتم کربن.","factFa":"در پروپن، دو کربنِ پیوند دوگانه و اتم‌های متصل مستقیم به آن‌ها در یک صفحه قرار می‌گیرند."},
    {"id":"benzene","name":"Benzene","formula":"C6H6","smiles":"c1ccccc1","cid":241,"category":"aromatic","nameFa":"بنزن","formulaFa":"C₆H₆","descEn":"A planar aromatic six-membered carbon ring with delocalized π electrons.","descFa":"حلقه‌ای آروماتیک و مسطح با شش اتم کربن و الکترون‌های π غیرموضعی.","factFa":"در بنزن، شش پیوند C–C هم‌ارزند؛ نمایش پیوندهای متناوب فقط یک ساختار رزونانسی قراردادی است."}
]

for item in items:
    mol = Chem.MolFromSmiles(item['smiles'])
    if mol is None:
        raise ValueError(f"Invalid SMILES: {item['smiles']}")
    actual_formula = rdMolDescriptors.CalcMolFormula(mol)
    if actual_formula != item['formula']:
        raise ValueError(f"Formula mismatch for {item['name']}: {actual_formula} != {item['formula']}")
    item['molarMass'] = round(Descriptors.MolWt(mol), 2)
    mol_h = Chem.AddHs(mol)
    params = AllChem.ETKDGv3()
    params.randomSeed = 0xC0FFEE + item['cid']
    params.useRandomCoords = False
    result = AllChem.EmbedMolecule(mol_h, params)
    if result != 0:
        raise RuntimeError(f"Could not embed {item['name']}")
    if AllChem.MMFFHasAllMoleculeParams(mol_h):
        AllChem.MMFFOptimizeMolecule(mol_h, maxIters=500, mmffVariant='MMFF94s')
        item['conformerMethod'] = 'RDKit ETKDGv3 embedding + MMFF94s minimization'
    else:
        AllChem.UFFOptimizeMolecule(mol_h, maxIters=500)
        item['conformerMethod'] = 'RDKit ETKDGv3 embedding + UFF minimization'
    conf = mol_h.GetConformer()
    # Center coordinates on the heavy-atom centroid for consistent model framing.
    heavy = [a.GetIdx() for a in mol_h.GetAtoms() if a.GetSymbol() != 'H']
    centroid = [sum(conf.GetAtomPosition(i)[k] for i in heavy)/len(heavy) for k in range(3)]
    atoms=[]
    for atom in mol_h.GetAtoms():
        p=conf.GetAtomPosition(atom.GetIdx())
        atoms.append({
            'element': atom.GetSymbol(),
            'x': round(p.x-centroid[0], 4),
            'y': round(p.y-centroid[1], 4),
            'z': round(p.z-centroid[2], 4),
            'formalCharge': atom.GetFormalCharge()
        })
    bonds=[]
    for bond in mol_h.GetBonds():
        bt = bond.GetBondType()
        bonds.append({
            'source': bond.GetBeginAtomIdx(),
            'target': bond.GetEndAtomIdx(),
            'order': 1.5 if bt == Chem.BondType.AROMATIC else float(bond.GetBondTypeAsDouble()),
            'aromatic': bool(bond.GetIsAromatic())
        })
    item['atoms']=atoms
    item['bonds']=bonds
    item['atomCount']=len(atoms)
    item['carbonCount']=sum(1 for a in atoms if a['element']=='C')
    item['hydrogenCount']=sum(1 for a in atoms if a['element']=='H')

out = Path(__file__).resolve().parent / 'src' / 'data' / 'molecules.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump(items,f,ensure_ascii=False,separators=(',',':'))
print('Generated', len(items), 'molecules at', out)
for x in items:
    print(x['name'], x['formula'], f"{x['molarMass']:.2f}", len(x['atoms']), len(x['bonds']))
