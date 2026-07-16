"""
ISLAMIC INHERITANCE CALCULATOR (Sunni / majority view)
=======================================================
Written as an explicit if/else decision tree so you can READ the rules.

Uses Python's Fraction class so shares are exact (no floating point errors).

SIMPLIFICATIONS (noted where relevant):
- Handles the most common heirs: spouse, sons, daughters, father, mother,
  grandfather, grandmother, son's children, full/paternal/maternal siblings,
  paternal uncles, nephews.
- Grandfather-with-siblings uses the Hanafi view (grandfather blocks siblings).
- Radd (return of surplus) excludes the spouse (majority view).
- This is EDUCATIONAL. Real estates need a qualified scholar / local law.
"""

from fractions import Fraction as F


def calculate_inheritance(
    deceased_gender,        # "male" or "female"
    husband=False,          # only if deceased is female
    wives=0,                # 0-4, only if deceased is male
    sons=0,
    daughters=0,
    sons_sons=0,            # grandsons through a son
    sons_daughters=0,       # granddaughters through a son
    father=False,
    mother=False,
    paternal_grandfather=False,
    grandmothers=0,         # maternal and/or paternal grandmother (1 or 2)
    full_brothers=0,
    full_sisters=0,
    paternal_half_brothers=0,
    paternal_half_sisters=0,
    maternal_half_siblings=0,   # brothers and sisters share equally
    full_nephews=0,             # full brother's sons
    paternal_uncles=0,          # father's full brothers
    uncles_sons=0,              # cousins
):
    shares = {}          # heir -> Fraction of estate
    notes = []           # explanation log

    # ----------------------------------------------------------------
    # STEP 0: derived facts used everywhere in the tree
    # ----------------------------------------------------------------
    has_child = (sons + daughters) > 0
    has_male_descendant = sons > 0 or sons_sons > 0
    has_descendant = has_child or sons_sons > 0 or sons_daughters > 0

    # Grandfather only counts if father is dead (father blocks him)
    if father:
        paternal_grandfather = False

    # For sibling-share rules, "father figure" blocks siblings.
    # Hanafi view: grandfather ALSO blocks all siblings.
    father_figure = father or paternal_grandfather

    total_full_siblings = full_brothers + full_sisters
    total_paternal_half_siblings = paternal_half_brothers + paternal_half_sisters
    total_half_siblings = total_paternal_half_siblings + maternal_half_siblings

    # Count siblings for the mother's 1/6 rule (any two or more siblings)
    total_siblings = (full_brothers + full_sisters +
                      paternal_half_brothers + paternal_half_sisters +
                      maternal_half_siblings)

    # ================================================================
    # PART 1: FIXED SHARES (Ashab al-Furud)
    # ================================================================

    # ---------- SPOUSE ----------
    if deceased_gender == "female":
        if husband:
            if has_descendant:
                shares["husband"] = F(1, 4)
                notes.append("Husband: 1/4 (deceased has descendants)")
            else:
                shares["husband"] = F(1, 2)
                notes.append("Husband: 1/2 (no descendants)")
    else:  # deceased is male
        if wives > 0:
            if has_descendant:
                shares["wives (total)"] = F(1, 8)
                notes.append(f"Wife/wives: 1/8 shared by {wives} (has descendants)")
            else:
                shares["wives (total)"] = F(1, 4)
                notes.append(f"Wife/wives: 1/4 shared by {wives} (no descendants)")

    # ---------- MOTHER ----------
    if mother:
        if has_descendant or total_siblings >= 2:
            shares["mother"] = F(1, 6)
            notes.append("Mother: 1/6 (descendants exist, or 2+ siblings)")
        else:
            # Check for the Umariyyatan special case:
            # deceased leaves ONLY spouse + father + mother
            spouse_exists = husband or wives > 0
            if spouse_exists and father and total_siblings == 0:
                # Mother gets 1/3 of what REMAINS after the spouse,
                # not 1/3 of the whole estate (Caliph Umar's ruling)
                spouse_share = shares.get("husband", shares.get("wives (total)", F(0)))
                shares["mother"] = (F(1) - spouse_share) * F(1, 3)
                notes.append("Mother: 1/3 of REMAINDER after spouse (Umariyyatan case)")
            else:
                shares["mother"] = F(1, 3)
                notes.append("Mother: 1/3 (no descendants, fewer than 2 siblings)")

    # ---------- GRANDMOTHER(S) ----------
    if grandmothers > 0 and not mother:
        shares["grandmother(s)"] = F(1, 6)
        notes.append("Grandmother(s): 1/6 shared (mother is dead)")

    # ---------- FATHER (fixed portion; residue handled in Part 2) ----------
    father_takes_residue = False
    if father:
        if has_male_descendant:
            shares["father"] = F(1, 6)
            notes.append("Father: 1/6 only (a son/grandson exists)")
        elif has_descendant:  # only female descendants
            shares["father"] = F(1, 6)
            father_takes_residue = True
            notes.append("Father: 1/6 + any residue (only female descendants)")
        else:
            father_takes_residue = True
            notes.append("Father: takes residue as closest male heir (no descendants)")
    elif paternal_grandfather:
        # Grandfather steps into father's role
        if has_male_descendant:
            shares["grandfather"] = F(1, 6)
            notes.append("Grandfather: 1/6 only (a son/grandson exists)")
        elif has_descendant:
            shares["grandfather"] = F(1, 6)
            father_takes_residue = True
            notes.append("Grandfather: 1/6 + residue (only female descendants)")
        else:
            father_takes_residue = True
            notes.append("Grandfather: takes residue (no descendants)")

    # ---------- DAUGHTERS (only when NO son; with a son they're residuary) ----------
    if daughters > 0 and sons == 0:
        if daughters == 1:
            shares["daughter"] = F(1, 2)
            notes.append("One daughter: 1/2")
        else:
            shares["daughters (total)"] = F(2, 3)
            notes.append(f"{daughters} daughters: 2/3 shared")

    # ---------- SON'S DAUGHTERS ----------
    if sons_daughters > 0 and sons == 0 and sons_sons == 0:
        if daughters == 0:
            if sons_daughters == 1:
                shares["son's daughter"] = F(1, 2)
                notes.append("Son's daughter: 1/2 (acts like a daughter)")
            else:
                shares["son's daughters (total)"] = F(2, 3)
                notes.append("Son's daughters: 2/3 shared")
        elif daughters == 1:
            shares["son's daughter(s)"] = F(1, 6)
            notes.append("Son's daughter(s): 1/6 (completes 2/3 with one daughter)")
        else:
            notes.append("Son's daughters: BLOCKED (two+ daughters used up the 2/3)")

    # ---------- MATERNAL HALF-SIBLINGS (kalalah only) ----------
    if maternal_half_siblings > 0:
        if has_descendant or father_figure:
            notes.append("Maternal half-siblings: BLOCKED (descendant or father exists)")
        else:
            if maternal_half_siblings == 1:
                shares["maternal half-sibling"] = F(1, 6)
                notes.append("One maternal half-sibling: 1/6")
            else:
                shares["maternal half-siblings (total)"] = F(1, 3)
                notes.append("Maternal half-siblings: 1/3 shared EQUALLY (male=female)")

    # ---------- FULL SISTERS (fixed share only when no full brother) ----------
    sisters_get_fixed = (full_sisters > 0 and full_brothers == 0
                         and not has_descendant and not father_figure)
    if sisters_get_fixed:
        # Special: with daughters present, sisters become residuary instead
        if daughters > 0 or sons_daughters > 0:
            sisters_get_fixed = False   # handled in residue as "asabah ma'a al-ghayr"
        elif full_sisters == 1:
            shares["full sister"] = F(1, 2)
            notes.append("One full sister: 1/2")
        else:
            shares["full sisters (total)"] = F(2, 3)
            notes.append(f"{full_sisters} full sisters: 2/3 shared")

    # ---------- PATERNAL HALF-SISTERS ----------
    if (paternal_half_sisters > 0 and paternal_half_brothers == 0
            and not has_descendant and not father_figure
            and full_brothers == 0):
        if full_sisters == 0:
            if paternal_half_sisters == 1:
                shares["paternal half-sister"] = F(1, 2)
                notes.append("One paternal half-sister: 1/2")
            else:
                shares["paternal half-sisters (total)"] = F(2, 3)
                notes.append("Paternal half-sisters: 2/3 shared")
        elif full_sisters == 1:
            shares["paternal half-sister(s)"] = F(1, 6)
            notes.append("Paternal half-sister(s): 1/6 (completes 2/3)")
        else:
            notes.append("Paternal half-sisters: BLOCKED (two+ full sisters)")

    # ================================================================
    # PART 2: RESIDUE (Asabah) — who gets what's left, in priority order
    # ================================================================
    used = sum(shares.values())
    residue = F(1) - used

    if residue > 0:
        # --- Priority 1: SONS (daughters join them at 2:1) ---
        if sons > 0:
            units = sons * 2 + daughters
            if daughters > 0:
                shares["sons (total)"] = residue * F(sons * 2, units)
                shares["daughters (total)"] = residue * F(daughters, units)
                notes.append(f"Residue -> {sons} son(s) & {daughters} daughter(s), "
                             "each son gets double each daughter")
            else:
                shares["sons (total)"] = residue
                notes.append(f"Residue -> {sons} son(s) equally")
            residue = F(0)

        # --- Priority 2: SON'S SONS (son's daughters join at 2:1) ---
        elif sons_sons > 0:
            units = sons_sons * 2 + sons_daughters
            if sons_daughters > 0:
                shares["son's sons (total)"] = residue * F(sons_sons * 2, units)
                shares["son's daughters (total)"] = residue * F(sons_daughters, units)
            else:
                shares["son's sons (total)"] = residue
            notes.append("Residue -> grandsons (granddaughters join at 2:1)")
            residue = F(0)

        # --- Priority 3: FATHER / GRANDFATHER ---
        elif father_takes_residue:
            key = "father" if father else "grandfather"
            shares[key] = shares.get(key, F(0)) + residue
            notes.append(f"Residue -> {key}")
            residue = F(0)

        # --- Priority 4: FULL BROTHERS (full sisters join at 2:1) ---
        elif full_brothers > 0 and not father_figure:
            units = full_brothers * 2 + full_sisters
            if full_sisters > 0:
                shares["full brothers (total)"] = residue * F(full_brothers * 2, units)
                shares["full sisters (total)"] = residue * F(full_sisters, units)
            else:
                shares["full brothers (total)"] = residue
            notes.append("Residue -> full brothers (sisters join at 2:1)")
            residue = F(0)

        # --- Priority 4b: FULL SISTERS with daughters (asabah ma'a al-ghayr) ---
        elif (full_sisters > 0 and not father_figure
              and (daughters > 0 or sons_daughters > 0)):
            shares["full sisters (residue)"] = residue
            notes.append("Residue -> full sisters (become residuary WITH daughters)")
            residue = F(0)

        # --- Priority 5: PATERNAL HALF-BROTHERS ---
        elif paternal_half_brothers > 0 and not father_figure:
            units = paternal_half_brothers * 2 + paternal_half_sisters
            if paternal_half_sisters > 0:
                shares["paternal half-brothers (total)"] = residue * F(paternal_half_brothers * 2, units)
                shares["paternal half-sisters (total)"] = residue * F(paternal_half_sisters, units)
            else:
                shares["paternal half-brothers (total)"] = residue
            notes.append("Residue -> paternal half-brothers")
            residue = F(0)

        # --- Priority 6: NEPHEWS (full brother's sons) ---
        elif full_nephews > 0 and not father_figure:
            shares["nephews (total)"] = residue
            notes.append("Residue -> full brothers' sons")
            residue = F(0)

        # --- Priority 7: PATERNAL UNCLES ---
        elif paternal_uncles > 0 and not father_figure:
            shares["paternal uncles (total)"] = residue
            notes.append("Residue -> paternal uncles")
            residue = F(0)

        # --- Priority 8: UNCLES' SONS (cousins) ---
        elif uncles_sons > 0 and not father_figure:
            shares["cousins (total)"] = residue
            notes.append("Residue -> paternal cousins")
            residue = F(0)

    # ================================================================
    # PART 3: AWL — shares exceed the estate -> scale everything down
    # ================================================================
    total = sum(shares.values())
    if total > 1:
        notes.append(f"AWL applied: shares totalled {total}, all scaled down proportionally")
        for k in shares:
            shares[k] = shares[k] / total

    # ================================================================
    # PART 4: RADD — surplus remains and no residuary -> return it
    #          to fixed-share heirs proportionally (EXCLUDING spouse)
    # ================================================================
    total = sum(shares.values())
    if total < 1 and shares:
        surplus = F(1) - total
        radd_heirs = {k: v for k, v in shares.items()
                      if k not in ("husband", "wives (total)")}
        if radd_heirs:
            base = sum(radd_heirs.values())
            for k in radd_heirs:
                shares[k] += surplus * (radd_heirs[k] / base)
            notes.append("RADD applied: surplus returned to blood heirs proportionally")
        else:
            notes.append(f"Surplus of {surplus} -> Bayt al-Mal (public treasury) "
                         "or distant kindred")

    return shares, notes


def print_result(title, shares, notes, estate=None):
    print("=" * 60)
    print(title)
    print("=" * 60)
    for n in notes:
        print("  *", n)
    print("-" * 60)
    for heir, frac in shares.items():
        line = f"  {heir:<32} {str(frac):>8}  ({float(frac)*100:.2f}%)"
        if estate:
            line += f"  = {float(frac)*estate:,.0f}"
        print(line)
    print(f"  {'TOTAL':<32} {str(sum(shares.values())):>8}")
    print()


# ====================================================================
# DEMO SCENARIOS
# ====================================================================
if __name__ == "__main__":

    # 1. Classic: man dies, leaves wife, 2 sons, 1 daughter, both parents
    s, n = calculate_inheritance("male", wives=1, sons=2, daughters=1,
                                 father=True, mother=True)
    print_result("1) Man leaves: wife, 2 sons, 1 daughter, father, mother",
                 s, n, estate=1_000_000)

    # 2. Woman dies, leaves husband and 2 daughters (no sons), mother
    s, n = calculate_inheritance("female", husband=True, daughters=2, mother=True)
    print_result("2) Woman leaves: husband, 2 daughters, mother", s, n)

    # 3. AWL case: husband + 2 full sisters (shares = 1/2 + 2/3 = 7/6 > 1)
    s, n = calculate_inheritance("female", husband=True, full_sisters=2)
    print_result("3) AWL: husband + 2 full sisters", s, n)

    # 4. Umariyyatan: wife + father + mother
    s, n = calculate_inheritance("male", wives=1, father=True, mother=True)
    print_result("4) Umariyyatan: wife + father + mother", s, n)

    # 5. RADD: only mother + 1 daughter
    s, n = calculate_inheritance("male", mother=True, daughters=1)
    print_result("5) RADD: mother + 1 daughter only", s, n)

    # 6. No close heirs: only paternal uncles
    s, n = calculate_inheritance("male", wives=1, paternal_uncles=2)
    print_result("6) Wife + 2 paternal uncles only", s, n)

    # 7. Kalalah: maternal half-siblings + full brother
    s, n = calculate_inheritance("female", husband=True, mother=True,
                                 maternal_half_siblings=2, full_brothers=1)
    print_result("7) Kalalah: husband, mother, 2 maternal half-sibs, full brother",
                 s, n)
    