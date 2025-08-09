# 🔧 BACKEND REFACTORING PLAN

## 📋 Tóm tắt Lỗi hiện tại

### 1. Entity Field Mismatches
- ✅ **User entity**: `setName()` → `setFullName()` 
- ✅ **Recipe entity**: `getCreatedBy()` → `getAuthor().getId()`
- ❌ **Missing fields**: `bio`, `cookingSkillLevel` trong User entity
- ❌ **JSON fields**: `ingredientsJson`, `instructionsJson`, `tagsJson` không tồn tại trong Recipe

### 2. Repository Method Issues
- ✅ **Fixed imports**: Added correct repository imports
- ❌ **Method names**: `findByCreatedBy()` → `findByAuthor()`
- ❌ **Missing methods**: `countByUserIdAndCreatedAtAfter()`, `deleteByRecipeId()`

### 3. Enum & Type Conversion Issues
- ❌ **Difficulty enum**: String → Recipe.Difficulty conversion
- ❌ **Category entity**: String → Category entity conversion  
- ❌ **InteractionType enum**: String ↔ AiInteraction.InteractionType
- ❌ **SkillLevel enum**: SkillLevel ↔ String conversion

### 4. Map Type Issues
- ❌ **Interaction type counts**: Map<InteractionType,Long> → Map<String,Long>
- ❌ **Difficulty distribution**: Map<Difficulty,Long> → Map<String,Long>

## 🛠️ Giải pháp Áp dụng

### Phase 1: Entity & Repository Alignment ✅
- [x] Fix User field mappings
- [x] Fix Recipe author relationship
- [x] Update repository imports

### Phase 2: Repository Method Fixes 🔧
- [ ] Update all repository method calls
- [ ] Add missing repository methods
- [ ] Handle User ↔ Author relationships properly

### Phase 3: Enum & Type Conversions 🔧
- [ ] Add proper enum conversion utilities
- [ ] Fix all difficulty/category/interaction type mappings
- [ ] Add validation for enum values

### Phase 4: Frontend Integration 🔧
- [ ] Fix TypeScript interface mismatches
- [ ] Add proper accessibility attributes
- [ ] Complete Jest test setup

## 📝 Next Actions Required

1. **Complete Repository Methods**: Update all `findByCreatedBy` to `findByAuthor`
2. **Add Enum Converters**: Create utility methods for string ↔ enum conversion  
3. **Fix Map Types**: Add proper mapping for enum-to-string conversions
4. **Complete Frontend**: Fix remaining accessibility and type issues
5. **Add Missing Repository Methods**: Implement missing query methods
6. **Test Integration**: Ensure all components work together

## ✅ Success Criteria
- Zero compilation errors in backend
- Zero TypeScript errors in frontend  
- All tests pass
- Full accessibility compliance
- Complete API integration working
